import API from '../api';
import Password from './password';
import { IAMSchema, IAMLoginResponse, IAMSession } from '../types/external';
import type WebergencyIAM from '../iam';

const SLEEP = ( ms: number ) => new Promise( resolve => setTimeout( resolve, ms ));

export default class IAMAuthAPI<Schema extends IAMSchema>
{
    #api: API;
    #password: Password;
    #sessions = new Map<string, IAMSession<Schema>>();

    constructor( private iam: WebergencyIAM<any>, api: API )
    {
        this.#api = api;
        this.#password = new Password( iam );
    }

    public async login({ email, password, client }: { email: string, password: string, client: { ip?: string, userAgent?: string, acceptLanguage?: string }})
    {
        const delay = SLEEP( 1000 );
        const session = await this.#api.post<IAMLoginResponse<Schema>>( '/auth/login', { body: 
        { 
            email       : email.toLowerCase().trim(),
            password    : await this.#password.deriveKey({ email, password }),
            client
        }});

        // TODO cakat na delay ak ked je login failed

        await delay;

        const { key, ...rest } = session; this.#sessions.set( key, rest );

        return session;
    }

    public async register({ email, name, password, client, meta, data, }: { email: string, name: string, password: string, meta: Schema['user']['meta'], data: Schema['user']['data'], client: { ip?: string, userAgent?: string, acceptLanguage?: string }})
    {
        const delay = SLEEP( 2000 );
        const register = await this.#api.post<IAMLoginResponse<Schema>>( '/auth/register', { body: 
        { 
            name        : name.trim(),
            email       : email.toLowerCase().trim(),
            password    : await this.#password.deriveKey({ email, password }),
            meta,
            data,
            client
        }});

        await delay;

        return register;
    }

    //registerWithOTP - vygenerujeme jwt token a vratime otp kod ktory ma client poslat na email a potom sa prihlasit s tymto kodom

    public async logout( entity: ({ session: string } | { user: string }))
    {
        return this.#api.post<boolean>( '/auth/logout', { body: entity });
    }

    public async session( key: string )
    {
        if( this.#sessions.has( key ))
        {
            return this.#sessions.get( key );
        }

        const session = await this.#api.get<IAMSession<Schema>>( '/auth/session/' + key );

        if( session )
        {
            this.#sessions.set( key, session );
        }

        return session;
    }
}