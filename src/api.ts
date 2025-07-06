type Body = Record<string, any>;

const SUFFIXES = { organization: '0'.repeat( 18 ), project: '0'.repeat( 14 ), instance: '0'.repeat( 10 ), entity: '' };
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62( hex: string, length = 16 ): string
{
    let value = BigInt( '0x' + hex ), base62 = [];
    
    while( value > 0 )
    {
        const remainder = value % BigInt(62);
        base62.push( BASE62[Number(remainder)]);
        value = value / BigInt(62);
    }

    return ( base62.length ? base62.reverse().join('') : BASE62[0] ).padStart( length, '0' );
}

function fromBase62( base62: string, bytes: number = 24 ): string
{
    let value = BigInt(0);

    for( let i = 0; i < base62.length; ++i )
    {
        value = value * BigInt(62) + BigInt( BASE62.indexOf(base62[i]));
    }

    return value.toString(16).padStart( 2 * Math.ceil(value.toString(16).length / 2), '0').padStart( bytes, '0' );
}

export function toOrganizationID( projectID: string ): string
{
    return toBase62( fromBase62( projectID ).substring( 0, 6 ) + SUFFIXES.organization );
}
/*
export function toProjectID( instanceID: string ): string
{
    return toBase62( fromBase62( instanceID ).substring( 0, 10 ) + SUFFIXES.project );
}

export function toInstanceID( entityID: string ): string
{
    return toBase62( fromBase62( entityID ).substring( 0, 14 ) + SUFFIXES.instance );
}*/

const dateReviver = ( key: string, value: any ) =>
{
    if( typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)){ return new Date( value )}

    return value;
}

export default class API
{
    constructor( public apiKey: string, public baseURL: string ){}

    private async request<T>( path: string, { method, body }: { method: 'GET' | 'POST', body?: Body } = { method: 'GET' }): Promise<T>
    {
        //console.log( this.baseURL + path, { method, body });

        const req = await fetch( this.baseURL + path, 
        {
            method,
            headers:
            {
                'Authorization' : 'Bearer ' + this.apiKey,
                ...([ 'POST' ].includes( method ) && body ? { 'Content-Type'  : 'application/json' } : {}) ,
            },
            body: [ 'POST' ].includes( method ) ? JSON.stringify( body ) : undefined
        });

        let data: undefined | T | string | Blob;

        if( req.headers.get('Content-Type')?.startsWith('application/json' ))
        {
            data = JSON.parse( await req.text(), dateReviver );
        }
        else if( req.headers.get('Content-Type')?.startsWith('text' ))
        {
            data = await req.text();
        }
        else
        {
            data = await req.blob();
        }

        if( !req.ok )
        {
            console.error( 'Error', req.status, req.statusText, data );

            throw { code: req.status, message: req.statusText, data };
        }

        return data as T;
    }

    public async get<T>( path: string ): Promise<T>
    {
        return this.request<T>( path, { method: 'GET' });
    }

    public async post<T>( path: string, { body }: { body?: Body } = {}): Promise<T>
    {
        return this.request<T>( path, { method: 'POST', body });
    }
}