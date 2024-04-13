import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { generateOTP , verifyOTP} from "@repo/ui/otpUtils";
import twilio from 'twilio';

export const authOptions = {
    
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                console.log(`password from DB is ${existingUser.password}`);
                console.log(`Raw password from user is ${credentials.password}`)
                console.log(`Hashed password from user is ${hashedPassword}`);
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
                // You should send an OTP to the users phone number
                // const twilioClient = twilio('','');
                // async function sendOTP(phoneNumber: string, otp: string){
                //     try {
                //         const message= await twilioClient.message.create({
                //             body: `your OTP is: ${otp}`,
                //             from: '',
                //             to: phoneNumber
                //         });
                //         console.log('OTP sent successfully:', message.sid);
                //     } catch (error) {
                //         console.error('Error sending OTP:', error);
                //         throw new Error('Failed to send OTP');
                //     }
                // }
               // await sendOTP(credentials.phone, generateOTP);
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
  }
  