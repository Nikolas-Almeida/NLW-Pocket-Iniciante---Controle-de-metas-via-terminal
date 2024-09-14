// Importanto a biblioteca 'inquirer', módulo 'select'
const { select, input, checkbox } = require('@inquirer/prompts')
// Importando a biblioteca para trabalhar com json
const fs = require('fs').promises

let mensagem = 'Bem vindo ao app de metas!';
let metas = [];

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    console.log('Digite "sair" para voltar ao menu')

    // Recebendo a meta do usuário
    const meta = await input({
        message: 'Digite a meta: ',
        instructions: false
    })

    // Verificando se deseja sair ou se a meta é vazia
    if(meta == "sair") {
        mensagem = 'Retornando ao menu...'
        return
    } else if (meta.length == 0) {
        console.log('A meta não pode ser vazia\n');
        return cadastrarMeta();
    }

    // Adicionando a meta à lista de metas
    metas.push({
        value: meta, checked: false
    })

    mensagem = 'Meta cadastrada com sucesso!'
}

const listarMetas = async () => {
    // Verifica se existe alguma meta
    if(metas.length == 0) {
        mensagem = 'Nenhuma meta cadastrada'
        return
    }

    // Exibindo as metas cadastradas
    const respostas = await checkbox({
        message: 'Use as setas para mudar de meta; \nEspaço para marcar ou desmarcar; \nEnter para finalizar essa etapa',
        choices: [...metas],
        instructions: false
    })

    // Marcando as metas como não concluídas para poder desmarcar as desejadas
    metas.forEach((m) => {
        m.checked = false
    })

    // Verificando se existe alguma meta cadastrada
    if(respostas.length == 0) {
        mensagem = 'Nenhuma meta selecionada'
        return
    }

    /*
    Marcando as metas selecionadas como concluídas
    Essa parte irá verificar todas as que estão marcadas como concluídas e torna-las concluídas novamente, verificando uma por uma.
    */
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta(s) marcada(s) como concluída(s)'
}

const metasRealizadas = async () => {
    // Verificando quais metas estão marcadas como true
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    // Verifica se não existe metas realizadas
    if(realizadas.length == 0) {
        mensagem = 'Nenhuma meta realizada :('
        return
    }

    // Exibindo as metas realizadas
    await select({
        message: 'Metas realizadas:',
        choices: [...realizadas],
        instructions: false
    })
}

const metasAbertas = async () => {
    // Verificando quais metas estão marcadas como false
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    // Verificando se tem alguma meta aberta
    if(abertas.length == 0) {
        mensagem = 'Todas as metas foram realizadas :)'
        return
    }

    await select({
        message: 'Metas abertas:',
        choices: [...abertas],
        instructions: false
    })
}

const deletarMeta = async () => {
    if(metas.length == 0) {
        mensagem = 'Nenhuma meta para deletar'
        return
    }

    // Transformando todas as metas em desmarcadas
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    // Apresentando as metas para seleção
    const itensADeletar = await checkbox({
        message: 'Selecione a(s) meta(s) para exclusão.\n\nUse as setas para mudar de meta; \nEspaço para marcar ou desmarcar; \nEnter para finalizar essa etapa',
        choices: [...metasDesmarcadas],
        instructions: false
    })

    // Verifica se foi selecionada alguma meta para deletar
    if(itensADeletar.length == 0) {
        mensagem = 'Nenhuma meta selecionada para deletar'
        return
    }

    /*
        Verifica se o item selecionado é diferente do item da lista meta.
        Se for diferente, ele remove este item da lista de metas
    */
    itensADeletar.forEach((item) => {
        metas = metas.filter ((meta) => {
            return meta.value != item
        })
    })

    mensagem = 'Meta(s) deletada(s) com sucesso!'
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != '') {
        console.log(`${mensagem}\n`)
        mensagem = ''
    }
}

const start = async () => {
    await carregarMetas();
    while(true) {
        await salvarMetas();
        mostrarMensagem();
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
                    name: 'Metas realizadas',
                    value: 'realizadas'
                },
                {
                    name: 'Metas abertas',
                    value: 'abertas'
                },
                {
                    name: 'Deletar metas',
                    value: 'deletar'
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
                await salvarMetas();
                break;
            case 'listar':
                await listarMetas();
                await salvarMetas();
                break;
            case 'realizadas':
                await metasRealizadas();
                break;
            case 'abertas':
                await metasAbertas();
                break;
            case 'deletar':
                await deletarMeta();
                break;
            case 'sair':
                console.log('Até logo!');
                return
        }
    }
}

start()