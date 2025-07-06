import { pbkdf2, createHash } from 'node:crypto';
import type WebergencyIAM from '../iam';

export default class Password
{
    constructor( private iam: WebergencyIAM<any> ){}

    public async deriveKey({ email, password }: { email: string, password: string }): Promise<string>
    {
        try
        {
            if( Buffer.from( password, 'base64url' ).length === 64 ){ return password }
        }
        catch{}
        
        const salt = createHash('sha256').update( email.toLowerCase().trim() + ( await this.iam.info ).context.organizationID ).digest().subarray(0, 16);

        return await new Promise<string>(( resolve, reject ) => 
            pbkdf2( password.trim(), salt, 98765, 64, 'sha256', ( err, key ) =>
            {
                err ? reject( err ) : resolve( key.toString('base64url'));
            }
        ));
    }
}