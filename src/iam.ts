import API from './api';
import IAMAuthAPI from './classes/auth';
import IAMUserAPI from './classes/user';
import { IAMSchema } from './types/external';

export default class WebergencyIAM<Schema extends IAMSchema>
{
    #api: API;

    readonly auth: IAMAuthAPI<Schema>;
    readonly user: IAMUserAPI<Schema>;
    readonly info: Promise<any>;

    constructor( apiKey: string )
    {
        this.#api = new API( apiKey, 'https://iam.api.webergency.com' );
        //this.#api = new API( apiKey, 'http://localhost:8082' );

        this.auth = new IAMAuthAPI( this, this.#api );
        this.user = new IAMUserAPI( this, this.#api );
        this.info = this.bootstrap();
    }

    private async bootstrap()
    {
        const info = await this.#api.get<any>( '/bootstrap' );

        if( info.type !== 'iam' )
        {
            throw new Error( 'Invalid IAM API' );
        }

        return info;
    }
}