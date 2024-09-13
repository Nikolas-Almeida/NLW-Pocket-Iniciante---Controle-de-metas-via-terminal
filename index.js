// Importanto a biblioteca 'inquirer', módulo 'select'
const { select } = require('@inquirer/prompts')

const start = async () => {
    while(true) {
        // Recebendo a opção do usuário
        const opcao = await select({
            message: 'Menu',
            choices: [
                {
                    name: 'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name: 'Listar metas',
                    value: 'listar'
                },
                {
                    name: 'Sair',
                    value: 'sair'
                }
            ]
        })

        // Verificando a opção escolhida
        switch(opcao) {
            case 'cadastrar':
                console.log('Vamos cadastrar');
                break;
            case 'listar':
                console.log('Vamos listar');
                break;
            case 'sair':
                console.log('Até logo!');
                return
        }
    }
}

start()