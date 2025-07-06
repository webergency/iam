import WebergencyIAM from './iam';

type MyIAM = 
{
    user    : { meta: { role: 'admin' }, data: { age: number }}
    session : { meta: { ip: string }, data: { userAgent: string }}
}

async function test()
{
    const iam = new WebergencyIAM<MyIAM>( 'cdB9nccRl4qdy20vDm06hnZvFmqRBXw2V6M5t8dfIOWzpXb3uxvJ1NFkZobuKb' );

    /** /console.log( await iam.user.list() );

    console.log( 'Info', await iam.info );
    /**/

    const login = await iam.auth.login({ email: 'radixxko@gmail.com', password: 'mojeheslo', client: {} });

    //console.log( 'Login', login );

    //login.user.meta.role = 'admin';

    console.log( login );
    
    console.log('Getting session', await iam.auth.session( login.key ));
    
    /**/

    /*console.log( await iam.auth.session( '2yMambapjfuaPeeculiCI17ZDkUDDh3I2KvyU8' ));
    console.log( await iam.auth.session( '2yMambapjfuaPeeculiCI17ZDkUDDh3I2KvyU8' ));
    console.log( await iam.auth.session( '2yMambapjfuaPeeculiCI17ZDkUDDh3I2KvyU8' ));*/
}

test();