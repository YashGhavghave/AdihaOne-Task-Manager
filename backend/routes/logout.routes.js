import express from "express";
const Router = express.Router();

Router.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Lax" });
  return res.status(200).json({ message: "Logged out successfully" });
});

export default Router;
