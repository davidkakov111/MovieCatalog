import { hash } from 'bcrypt';
import { createUserRecord } from '../../../database/dbmethods';

export async function POST(request: Request) {
  try {
    // Extract user data from the request body
    const { email, password} = await request.json();
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create user record in the database
    const result = await createUserRecord(email as string, hashedPassword);
    
    // In case of successful registration
    if (result === 'Success') {
      return new Response(JSON.stringify({ success: true, message: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // In case of error
      return new Response(JSON.stringify({ success: false, message: result }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    // In case of server error
    return new Response(JSON.stringify({ success: false, message: 'Server error!' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
