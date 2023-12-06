import { Response } from 'express';

const defaultCookieOptions = {
  // httpOnly: true,
  maxAge: 3.154e10,
};

export default function (
  target: Response,
  name: string,
  val: string,
  options = defaultCookieOptions,
) {
  target.cookie(name, val, options);
}
