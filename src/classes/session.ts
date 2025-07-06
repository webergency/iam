import API from '../api';
import { IAMSchema, IAMLoginResponse, IAMUser, IAMSession } from '../types/external';
import type WebergencyIAM from '../iam';

export default class IAMSessionAPI<Schema extends IAMSchema>
{
    #api: API;

    constructor( private iam: WebergencyIAM<any>, api: API )
    {
        this.#api = api;
    }

    public async list()
    {
        return this.#api.post<IAMSession<Schema>[]>( '/sessions', {});
    }
}