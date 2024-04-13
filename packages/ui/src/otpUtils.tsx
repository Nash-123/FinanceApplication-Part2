export function generateOtp(length: number): string {
   const digits = '0123456789';
   let OTP = '';

   for (let i=0 ; i< length; i++){
      OTP += digits[Math.floor(Math.random() * 10)];
   }
   return OTP;

}


export function verifyOtp(inputOTP: string, outputOTP: string): boolean{

    return inputOTP === outputOTP;

}