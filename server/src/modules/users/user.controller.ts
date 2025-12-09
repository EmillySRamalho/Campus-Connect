import { Response } from "express";
import {
  LoginService,
  ProfileEditService,
  ProfileService,
  RegisterService,
} from "./user.service.js";
import { CustomRequest } from "../../middlewares/AuthGuard.js";

// Registro
export async function RegisterController(req: CustomRequest, res: Response) {
  try {
    const { name, nameUser, email, password } = req.body;

    const result = await RegisterService({ name, nameUser, email, password });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Login
export async function LoginController(req: CustomRequest, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await LoginService(email, password);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Perfil
export function ProfileController(req: CustomRequest, res: Response) {
  const user = req.user;
  const result = ProfileService(user);

  res.status(200).json(result);
}

// Editar dados do prfil
export async function ProfileEditController(req: CustomRequest, res: Response) {
  try {
    const id = req.user._id;

    const updates = req.body;

    const result = await ProfileEditService(id, updates);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
