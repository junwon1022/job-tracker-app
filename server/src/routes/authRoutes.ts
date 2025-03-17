    import express, { Request, Response } from "express";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";
    import { body, validationResult } from "express-validator";
    import User from "../models/User";

    const router = express.Router();

    router.post(
        "/login",
        [
          body("email", "Please include a valid email").isEmail(),
          body("password", "Password is required").exists(),
        ],
        async (req: Request, res: Response): Promise<void> => {
          // Validate request
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
          }
      
          // Extract email/password from body
          const { email, password } = req.body;
      
          try {
            // Check for user in the database
            const user = await User.findOne({ email });
            if (!user) {
              res.status(400).json({ msg: "Invalid credentials" });
              return;
            }
      
            // Compare plain text password with the hashed password in DB
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              res.status(400).json({ msg: "Invalid credentials" });
              return;
            }
      
            // Create and sign a JWT
            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
              expiresIn: "1h",
            });
      
            // Return the token (or any other info you want)
            res.json({ token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email
              }
            });
          } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
          }
        }
      );

    // User Registration
    router.post(
        "/register",
        [
            body("name", "Name is required").notEmpty(),
            body("email", "Please enter a valid email").isEmail(),
            body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        ],
        async (req: Request, res: Response): Promise<void> => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return; // ✅ Ensure function exits after sending a response
            }

            const { name, email, password } = req.body;

            try {
                let user = await User.findOne({ email });
                if (user) {
                    res.status(400).json({ msg: "User already exists" });
                    return; // ✅ Ensure function exits
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                user = new User({ name, email, password: hashedPassword });

                await user.save();

                const payload = { user: { id: user.id } };
                const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });

                res.json({ 
                  token,
                  user: {
                    name: user.name,
                    email: user.email
                  }
                });
            } catch (error) {
                res.status(500).send("Server Error");
            }
        }
    );


    // Get All Users
    router.get("/", async (req, res) => {
      try {
        const users = await User.find().select("-password");
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
      }
  });


    // GET a user by ID
    router.get("/users/:id", async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await User.findById(req.params.id).exec(); 
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
    
        res.json({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          profilePic: user.profilePic || null, // Include profile picture
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // PUT a user by ID
    router.put("/users/:id", async (req: Request, res: Response): Promise<void> => {
      try {
        const { name, email } = req.body;

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { name, email },
          { new: true }
        );

        if (!updatedUser) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        res.json({
          id: updatedUser.id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          profilePic: updatedUser.profilePic || null,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Delete a user by ID
    router.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
      try{
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
          res.status(404).json({ message: "User not found" });
          return;
        }
      } catch(error){
        console.error("Error deleting user:", error);
        res.status(500).json({message: "Server error"});
      }
    });



    export default router;