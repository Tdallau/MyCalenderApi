import { Request, Response } from 'express';
import axios from 'axios';
import { Tokens } from '../models/tokens';
import { Credentials } from '../models/credentials';

export const login = async (req: Request, res: Response): Promise<void> => {
  const credentials = req.body as Credentials;
  if (
    credentials === undefined ||
    credentials.email === undefined ||
    credentials.password === undefined
  ) {
    res.status(403).json({
      success: false,
      error: 'Email en wachtwoord zijn verplicht',
    });
  }
  const user = await axios.post('https://home.dallau.com/authorization/login', {
    appId: '9c2660e7-36d4-40be-a47d-0d9de2b864fc',
    email: credentials.email,
    password: credentials.password,
  });
  res.status(200).json(user.data);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const credentials = req.body as Credentials;
  if (
    credentials === undefined ||
    credentials.email === undefined ||
    credentials.password === undefined
  ) {
    res.status(403).json({
      success: false,
      error: 'Email en wachtwoord zijn verplicht',
    });
  }
  try {
    const user = await axios.post(
      'https://home.dallau.com/authorization/register',
      {
        appId: '9c2660e7-36d4-40be-a47d-0d9de2b864fc',
        email: credentials.email,
        password: credentials.password,
      }
    );
    res.status(200).json(user.data);
  } catch (error) {
    res.status(403).json({success: false, error: 'email adres is al in gebruik'});
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const tokens = req.body as Tokens;
  if(tokens === undefined || tokens.JWTToken === undefined || tokens.refreshToken === undefined) {
    res.status(403).json({
      success: false,
      error: 'JWTToken en refreshToken zijn verplicht',
    });
  }
  const newTokens = await axios.post('https://home.dallau.com/authorization/refresh',
  {
    ...tokens
  })
  res.status(200).json(newTokens.data);
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  const tokens = req.body as Tokens;
  if(tokens === undefined || tokens.JWTToken === undefined || tokens.refreshToken === undefined) {
    res.status(403).json({
      success: false,
      error: 'JWTToken en refreshToken zijn verplicht',
    });
  }
  await axios.post('https://home.dallau.com/authorization/logout',
  {
    ...tokens
  });
  res.status(200).json({success: true, data: "Gebruiker is uitgelogd"})
}
