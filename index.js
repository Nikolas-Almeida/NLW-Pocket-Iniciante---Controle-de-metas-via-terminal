// Arrays, objetos
let meta = {
    value: 'Ler 1 livro por mês',
    address: 2,
    cheacked: true,
    log: (info) => {
        console.log(info);
    }
}

meta.log(meta.value)
meta.value = 'Caminhar 30 minutos por dia'
meta.log(meta.value)

// Arrow function
const criarMeta = () => {}