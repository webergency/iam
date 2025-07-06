import type { IAMSchema, IAMSessionDTO } from '@webergency-sro/iam-types';

export type { IAMSchema };

export type MetaData<Meta extends Record<string, any> = any, Data extends Record<string, any> = any> =
{
    meta: Meta
    data: Data
}

export type ClientInfo =
{
    agent   : string
    ip      : string
    country?: string
    locale  : string
    type    : 'device' | 'mobile' | 'tablet' | 'console' | 'smarttv' | 'wearable' | 'xr' | 'embedded' | 'cli' | 'crawler' | 'browser' | 'email' | 'fetcher' | 'app' | 'library' | 'player' | 'vehicle'
    browser?: { name: string, version?: string }
    device? : { type: string, vendor?: string, model?: string }
    engine? : { name: string, version?: string }
    os?     : { name: string, version?: string }
}

export type IAMUser<UserSchema extends MetaData> =
{
    id      : string
    email   : string
    name    : string
    events  : 
    {
        created : Date
        expires : Date
        deleted?: Date
    }
    meta    : UserSchema['meta']
    data    : UserSchema['data']
}

export type IAMSession<Schema extends IAMSchema> = IAMSessionDTO<Schema>;

export type IAMLoginResponse<Schema extends IAMSchema> = IAMSessionDTO<Schema> &
{
    key     : string
}