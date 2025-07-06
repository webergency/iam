import API from '../api';
import Password from './password';
import { IAMSchema, IAMLoginResponse, IAMUser } from '../types/external';
import type WebergencyIAM from '../iam';

export default class IAMUserAPI<Schema extends IAMSchema>
{
    #api: API;

    constructor( private iam: WebergencyIAM<any>, api: API )
    {
        this.#api = api;
    }

    public async list()
    {
        return this.#api.post<IAMUser<Schema['user']>[]>( '/users', {});
    }
}