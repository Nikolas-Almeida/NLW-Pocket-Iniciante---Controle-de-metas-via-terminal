// Importanto a biblioteca 'inquirer', módulo 'select'
const { select, input } = require('@inquirer/prompts')

let metas = [];

const cadastrarMeta = async () => {
    console.log('Digite "sair" para voltar ao menu')

    // Recebendo a meta do usuário
    const meta = await input({
        message: 'Digite a meta: '
    })

    // Verificando se deseja sair ou se a meta é vazia
    if(meta == "sair") {
        console.log('Retornando ao menu...')
        return
    } else if (meta.length == 0) {
        console.log('A meta não pode ser vazia\n');
        return cadastrarMeta();
    }

    // Adicionando a meta à lista de metas
    metas.push({
        value: meta, checked: false
    })
}

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
                await cadastrarMeta();
                console.log(metas)
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