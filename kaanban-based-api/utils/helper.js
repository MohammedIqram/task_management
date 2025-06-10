import puppeteer from "puppeteer";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from "../module/users.js";
import { RESPONSE_CODES, MESSAGES } from "./constant.js";
dotenv.config();

export const validateMail = (mail) => {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mail.match(validRegex)

}


/**
 * 
 * @param {res} while processing if any error asend then respond back to client
 * @param {password} encoded as new refresh token 
 * @returns if(success) @return refresh token else @return false
 */
export const generateRefToken = (res, password) => {
  try {
    return jwt.sign({ mail: password }, process.env.PRIVATE_KEY, { expiresIn: '1d' });
  } catch (err) {
    res.json({ statusCode: RESPONSE_CODES.EXCEPTION, message: err.message, error: err });
    return false;
  }
}

export const ServerResponse = (res, code = 200, message = 'Success', result = null) => {
  res.statusMessage = typeof message === 'string' ? message : MESSAGES.NO_EXCEPTION_MESSAGE;
  res.status(code).send(result);
}
