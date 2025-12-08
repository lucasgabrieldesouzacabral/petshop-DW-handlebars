const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Tutor = require('./models/tutor.model');
const Animal = require('./models/animal.model');
const Agendamento = require('./models/agendamento.model');
const Funcionario = require('./models/funcionario.model');
const Produto = require('./models/produto.model');
const Servico = require('./models/servico.model');
const Vacina = require('./models/vacina.model');
const db = require('./config/database');

Tutor.hasMany(Animal, { foreignKey: 'tutorId', as: 'Animais' });
Animal.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'Tutor' });

Animal.hasMany(Agendamento, { foreignKey: 'animalId', as: 'Agendamentos' });
Agendamento.belongsTo(Animal, { foreignKey: 'animalId', as: 'Animal' });

Funcionario.hasMany(Agendamento, { foreignKey: 'funcionarioId', as: 'Agendamentos' });
Agendamento.belongsTo(Funcionario, { foreignKey: 'funcionarioId', as: 'Funcionario' });

Animal.hasMany(Servico, { foreignKey: 'animalId', as: 'Servicos' });
Servico.belongsTo(Animal, { foreignKey: 'animalId', as: 'Animal' });

Funcionario.hasMany(Servico, { foreignKey: 'funcionarioId', as: 'Servicos' });
Servico.belongsTo(Funcionario, { foreignKey: 'funcionarioId', as: 'Funcionario' });

Produto.hasMany(Servico, { foreignKey: 'produtoId', as: 'Servicos' });
Servico.belongsTo(Produto, { foreignKey: 'produtoId', as: 'Produto' });

Vacina.hasMany(Agendamento, { foreignKey: 'vacinaId', as: 'Agendamentos' });
Agendamento.belongsTo(Vacina, { foreignKey: 'vacinaId', as: 'Vacina' });
//
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({
    defaultLayout: false, 
    helpers: {
        eq: (a, b) => a === b
    }}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));

db.sync({force: false}).then(() => {
    console.log('Banco de dados sincronizado');
});


app.get('/', (req, res) => {
    res.render('home');
})

//
//listar tutores
app.get('/tutores', async (req, res) => {
    try {
        let tutores = await Tutor.findAll();
        tutores = tutores.map(tutor => tutor.dataValues);
        res.render('listarTutores', {tutores});
    } catch (error){
        console.log(error);
        res.status(500).send('Erro ao buscar tutores');
    }
});


app.get('/tutores/novo', (req, res) => {
    res.render('cadastrarTutor');
});

//cadastrar tutor
app.post('/tutores', async (req, res) => {
    try {
        await Tutor.create({nome: req.body.nome, telefone: req.body.telefone, email: req.body.email});
        res.redirect('/tutores');
    } catch (error){
        console.log(error);
        res.status(500).send('Erro ao cadastrar tutor');
    }
});

//detalhar tutor
app.get('/tutores/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if (tutor) {
            res.render('detalharTutor', {tutor: tutor.dataValues});
        } else {
            res.status(404).send('Tutor não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutor');
    }
});

//editar tutor

app.get('/tutores/:id/editar', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if(!tutor)
            return res.status(404).send('Tutor não encontrado.');
        res.render('editarTutor', {tutor: tutor.dataValues});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutor');
    }
});

//atualizar tutor
app.post('/tutores/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if (tutor) {
            await tutor.update({
                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email
            });
            res.redirect('/tutores');
        } else {
            res.status(404).send('Tutor não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar tutor');
    }
});

//excluir tutor
app.post('/tutores/:id/excluir', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if(tutor) {
            await tutor.destroy();
            res.redirect('/tutores');
        } else {
            return res.status(404).send('Tutor não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir tutor');
    }
});

//listar animais
app.get('/animais', async (req, res) => {
    try {
        let animais = await Animal.findAll({
            include: [{model: Tutor, as: 'Tutor'}]
        });
        animais = animais.map(a => {
            let animalData = a.dataValues;
            return {
                ...animalData,
                tutorNome: animalData.Tutor ? animalData.Tutor.nome : 'Não informado'
            };
        });
        res.render('listarAnimais', {animais: animais});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar animais');
    }
});

// formulário de cadastro de animal
app.get('/animais/novo', async (req, res) => {
    try {
        let tutores = await Tutor.findAll();
        tutores = tutores.map(t => t.dataValues);
        res.render('cadastrarAnimal', {tutores: tutores});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutores');
    }
});

//cadastrar animal
app.post('/animais', async (req, res) => {
    try {
        await Animal.create({nome: req.body.nome, especie: req.body.especie, raca: req.body.raca,
             idade: parseInt(req.body.idade), tutorId: parseInt(req.body.tutorId)});
        res.redirect('/animais');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar animal');
    }
});

//detalhar animal
app.get('/animais/:id', async (req, res) => {
    try {
        let animal = await Animal.findByPk(req.params.id, {
            include: [{model: Tutor, as: 'Tutor'}]
        });
        let animalData = animal.dataValues;
        res.render('detalharAnimal', {
            animal: {
                ...animalData,
                tutorNome: animalData.Tutor ? animalData.Tutor.nome : 'Não informado'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao detalhar animal');
    }
});

//mostrar formulário de edição de animal
app.get('/animais/:id/editar', async (req, res) => {
    try {
        let animal = await Animal.findByPk(req.params.id);
        let tutores = await Tutor.findAll();
        if(!animal)
            return res.status(404).send('Animal não encontrado.');
        let tutoresData = tutores.map(t => t.dataValues);
        res.render('editarAnimal', {animal: animal.dataValues, tutores: tutoresData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar animal');
    }
});

//atualizar animal
app.post('/animais/:id', async (req, res) => {
    try {
        let animal = await Animal.findByPk(req.params.id);
        if (animal) {
            await animal.update({
                nome: req.body.nome,
                especie: req.body.especie,
                raca: req.body.raca,
                idade: parseInt(req.body.idade),
                tutorId: parseInt(req.body.tutorId)
            });
            res.redirect('/animais');
        } else {
            res.status(404).send('Animal não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar animal');
    }
});


//excluir animal

app.post('/animais/:id/excluir', async (req, res) => {
    try {
        let animal = await Animal.findByPk(req.params.id);

        await animal.destroy();

        res.redirect('/animais');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir animal');
    }
});

//listar agendamentos
app.get('/agendamentos', async (req, res) => {
    try {
        let agendamentos = await Agendamento.findAll({
            include: [
                {model: Animal, as: 'Animal', include: [{model: Tutor, as: 'Tutor'}]},
                {model: Funcionario, as: 'Funcionario'},
                {model: Vacina, as: 'Vacina'}
            ]
        });
        agendamentos = agendamentos.map(ag => {
            let agData = ag.dataValues;
            let animal = agData.Animal;
            let tutor = animal && animal.Tutor ? animal.Tutor : null;
            return {
                ...agData,
                animalNome: animal ? animal.nome : 'Não informado',
                animalEspecie: animal ? animal.especie : '',
                tutorNome: tutor ? tutor.nome : 'Não informado',
                funcionarioNome: agData.Funcionario ? agData.Funcionario.nome : 'Não atribuído'
            };
        });
        res.render('listarAgendamentos', {agendamentos: agendamentos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao listar agendamentos');
    }
});

// get formulário de cadastro de agendamento

app.get('/agendamentos/novo', async (req, res) => {
    try {
        let animais = await Animal.findAll();
        let funcionarios = await Funcionario.findAll();
        let vacinas = await Vacina.findAll();
        animais = animais.map(a => a.dataValues);
        funcionarios = funcionarios.map(f => f.dataValues);
        vacinas = vacinas.map(v => v.dataValues);
        res.render('cadastrarAgendamento', {animais: animais, funcionarios: funcionarios, vacinas: vacinas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar animais');
    }
});

// criar agemsframento
app.post('/agendamentos', async (req, res) => {
    try {
        await Agendamento.create({
            animalId: parseInt(req.body.animalId),
            funcionarioId: req.body.funcionarioId ? parseInt(req.body.funcionarioId) : null,
            tipoVacina: req.body.tipoVacina,
            vacinaId: req.body.vacinaId ? parseInt(req.body.vacinaId) : null,
            data: req.body.data,
            horario: req.body.horario,
            status: req.body.status
        });
        res.redirect('/agendamentos');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar agendamento');
    }
});

//detalhar agendamento
app.get('/agendamentos/:id', async (req, res) => {
    try {
        let agendamento = await Agendamento.findByPk(req.params.id, {
            include: [
                {model: Animal, as: 'Animal', include: [{model: Tutor, as: 'Tutor'}]},
                {model: Funcionario, as: 'Funcionario'},
                {model: Vacina, as: 'Vacina'}
            ]
        });
        let agData = agendamento.get({ plain: true });
        res.render('detalharAgendamento', {
            agendamento: {
                ...agData,
                animal: agData.Animal,
                tutor: agData.Animal?.Tutor,
                funcionario: agData.Funcionario
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao detalhar agendamento');
    }
});

//editar agendamento
app.get('/agendamentos/:id/editar', async (req, res) => {
    try {
        let agendamento = await Agendamento.findByPk(req.params.id);
        let animais = await Animal.findAll();
        let funcionarios = await Funcionario.findAll();
        let vacinas = await Vacina.findAll();
        if(!agendamento)
            return res.status(404).send('Agendamento não encontrado.');
        let animaisData = animais.map(a => a.dataValues);
        let funcionariosData = funcionarios.map(f => f.dataValues);
        let vacinasData = vacinas.map(v => v.dataValues);
        res.render('editarAgendamento', {
            agendamento: agendamento.dataValues,
            animais: animaisData,
            funcionarios: funcionariosData,
            vacinas: vacinasData
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar agendamento');
    }
});

//atualizar agendamento
app.post('/agendamentos/:id', async (req, res) => {
    try {
        let agendamento = await Agendamento.findByPk(req.params.id);
        if (agendamento) {
            await agendamento.update({
                animalId: parseInt(req.body.animalId),
                funcionarioId: req.body.funcionarioId ? parseInt(req.body.funcionarioId) : null,
                tipoVacina: req.body.tipoVacina,
                vacinaId: req.body.vacinaId ? parseInt(req.body.vacinaId) : null,
                data: req.body.data,
                horario: req.body.horario,
                status: req.body.status
            });
            res.redirect('/agendamentos');
        } else {
            res.status(404).send('Agendamento não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar agendamento');
    }
});

//excluir agendamento
app.post('/agendamentos/:id/excluir', async (req, res) => {
    try {
        let agendamento = await Agendamento.findByPk(req.params.id);
        
            await agendamento.destroy();

            res.redirect('/agendamentos');
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir agendamento');
    }
});



// novox 3 CRUD

//listar produtos
app.get('/produtos', async (req, res) => {
    try {
        let produtos = await Produto.findAll();
        produtos = produtos.map(p => p.dataValues);
        res.render('listarProdutos', {produtos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar produtos');
    }
});

// Página novo produto

app.get('/produtos/novo', (req, res) => {
    res.render('cadastrarProduto');
});

app.post('/produtos', async (req, res) => {
    try {
        await Produto.create({
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: parseFloat(req.body.preco),
            estoque: parseInt(req.body.estoque),
            categoria: req.body.categoria
        });
        res.redirect('/produtos');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar produto');
    }
});

//detalhar produto
app.get('/produtos/:id', async (req, res) => {
    try {
        let produto = await Produto.findByPk(req.params.id);
        if (produto) {
            res.render('detalharProduto', {produto: produto.dataValues});
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar produto');
    }
});

//editar produto
app.get('/produtos/:id/editar', async (req, res) => {
    try {
        let produto = await Produto.findByPk(req.params.id);
        if(!produto)
            return res.status(404).send('Produto não encontrado.');
        res.render('editarProduto', {produto: produto.dataValues});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar produto');
    }
});

//atualizar produto
app.post('/produtos/:id', async (req, res) => {
    try {
        let produto = await Produto.findByPk(req.params.id);
        if (produto) {
            await produto.update({
                nome: req.body.nome,
                descricao: req.body.descricao,
                preco: parseFloat(req.body.preco),
                estoque: parseInt(req.body.estoque),
                categoria: req.body.categoria
            });
            res.redirect('/produtos');
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar produto');
    }
});

//excluir produto
app.post('/produtos/:id/excluir', async (req, res) => {
    try {
        let produto = await Produto.findByPk(req.params.id);
        if(produto) {
            await produto.destroy();
            res.redirect('/produtos');
        } else {
            return res.status(404).send('Produto não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir produto');
    }
});

// CRUD SERVIÇOS
//listar serviços
app.get('/servicos', async (req, res) => {
    try {
        let servicos = await Servico.findAll({
            include: [
                {model: Animal, as: 'Animal', include: [{model: Tutor, as: 'Tutor'}]},
                {model: Funcionario, as: 'Funcionario'},
                {model: Produto, as: 'Produto'}
            ]
        });
        servicos = servicos.map(s => {
            let servicoData = s.dataValues;
            let animal = servicoData.Animal;
            let tutor = animal && animal.Tutor ? animal.Tutor : null;
            return {
                ...servicoData,
                animalNome: animal ? animal.nome : 'Não informado',
                tutorNome: tutor ? tutor.nome : 'Não informado',
                funcionarioNome: servicoData.Funcionario ? servicoData.Funcionario.nome : 'Não informado',
                produtoNome: servicoData.Produto ? servicoData.Produto.nome : 'Sem produto'
            };
        });
        res.render('listarServicos', {servicos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar serviços');
    }
});

//formulário de cadastro de serviço
app.get('/servicos/novo', async (req, res) => {
    try {
        let animais = await Animal.findAll();
        let funcionarios = await Funcionario.findAll();
        let produtos = await Produto.findAll();
        let animaisData = animais.map(a => a.dataValues);
        let funcionariosData = funcionarios.map(f => f.dataValues);
        let produtosData = produtos.map(p => p.dataValues);
        res.render('cadastrarServico', {
            animais: animaisData,
            funcionarios: funcionariosData,
            produtos: produtosData
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar dados');
    }
});

//cadastrar serviço
app.post('/servicos', async (req, res) => {
    try {
        await Servico.create({
            animalId: parseInt(req.body.animalId),
            funcionarioId: parseInt(req.body.funcionarioId),
            produtoId: req.body.produtoId ? parseInt(req.body.produtoId) : null,
            tipoServico: req.body.tipoServico,
            descricao: req.body.descricao,
            data: req.body.data,
            valor: parseFloat(req.body.valor),
            status: req.body.status || 'pendente'
        });
        res.redirect('/servicos');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar serviço');
    }
});

//detalhar serviço
app.get('/servicos/:id', async (req, res) => {
    try {
        let servico = await Servico.findByPk(req.params.id, {
            include: [
                {model: Animal, as: 'Animal', include: [{model: Tutor, as: 'Tutor'}]},
                {model: Funcionario, as: 'Funcionario'},
                {model: Produto, as: 'Produto'}
            ]
        });
        if (servico) {
            let servicoData = servico.dataValues;
            res.render('detalharServico', {
                servico: {
                    ...servicoData,
                    animal: servicoData.Animal,
                    tutor: servicoData.Animal?.Tutor,
                    funcionario: servicoData.Funcionario,
                    produto: servicoData.Produto
                }
            });
        } else {
            res.status(404).send('Serviço não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar serviço');
    }
});

//editar serviço
app.get('/servicos/:id/editar', async (req, res) => {
    try {
        let servico = await Servico.findByPk(req.params.id);
        let animais = await Animal.findAll();
        let funcionarios = await Funcionario.findAll();
        let produtos = await Produto.findAll();
        if(!servico)
            return res.status(404).send('Serviço não encontrado.');
        let animaisData = animais.map(a => a.dataValues);
        let funcionariosData = funcionarios.map(f => f.dataValues);
        let produtosData = produtos.map(p => p.dataValues);
        res.render('editarServico', {
            servico: servico.dataValues,
            animais: animaisData,
            funcionarios: funcionariosData,
            produtos: produtosData
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar serviço');
    }
});

//atualizar serviço
app.post('/servicos/:id', async (req, res) => {
    try {
        let servico = await Servico.findByPk(req.params.id);
        if (servico) {
            await servico.update({
                animalId: parseInt(req.body.animalId),
                funcionarioId: parseInt(req.body.funcionarioId),
                produtoId: req.body.produtoId ? parseInt(req.body.produtoId) : null,
                tipoServico: req.body.tipoServico,
                descricao: req.body.descricao,
                data: req.body.data,
                valor: parseFloat(req.body.valor),
                status: req.body.status
            });
            res.redirect('/servicos');
        } else {
            res.status(404).send('Serviço não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar serviço');
    }
});

//excluir serviço
app.post('/servicos/:id/excluir', async (req, res) => {
    try {
        let servico = await Servico.findByPk(req.params.id);
        if(servico) {
            await servico.destroy();
            res.redirect('/servicos');
        } else {
            return res.status(404).send('Serviço não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir serviço');
    }
});
// CRUD FUNCIONÁRIOS

//listar funcionários
app.get('/funcionarios', async (req, res) => {
    try {
        let funcionarios = await Funcionario.findAll();
        funcionarios = funcionarios.map(funcionario => funcionario.dataValues);
        res.render('listarFuncionarios', {funcionarios});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar funcionários');
    }
});

// Novo funcionário
app.get('/funcionarios/novo', (req, res) => {
    res.render('cadastrarFuncionario');
});

//cadastrar funcionário
app.post('/funcionarios', async (req, res) => {
    try {
        await Funcionario.create({
            nome: req.body.nome,
            cargo: req.body.cargo,
            telefone: req.body.telefone,
            email: req.body.email
        });
        res.redirect('/funcionarios');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar funcionário');
    }
});

//detalhar funcionário
app.get('/funcionarios/:id', async (req, res) => {
    try {
        let funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            res.render('detalharFuncionario', {funcionario: funcionario.dataValues});
        } else {
            res.status(404).send('Funcionário não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar funcionário');
    }
});

//editar funcionário
app.get('/funcionarios/:id/editar', async (req, res) => {
    try {
        let funcionario = await Funcionario.findByPk(req.params.id);
        if(!funcionario)
            return res.status(404).send('Funcionário não encontrado.');
        res.render('editarFuncionario', {funcionario: funcionario.dataValues});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar funcionário');
    }
});

//atualizar funcionário
app.post('/funcionarios/:id', async (req, res) => {
    try {
        let funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            await funcionario.update({
                nome: req.body.nome,
                cargo: req.body.cargo,
                telefone: req.body.telefone,
                email: req.body.email
            });
            res.redirect('/funcionarios');
        } else {
            res.status(404).send('Funcionário não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar funcionário');
    }
});

//excluir funcionário
app.post('/funcionarios/:id/excluir', async (req, res) => {
    try {
        let funcionario = await Funcionario.findByPk(req.params.id);
        if(funcionario) {
            await funcionario.destroy();
            res.redirect('/funcionarios');
        } else {
            return res.status(404).send('Funcionário não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir funcionário');
    }
});

//rotas vacinas novo cruasd

app.get('/vacinas', async (req, res) => {
    try {
        let vacinas = await Vacina.findAll();
        vacinas = vacinas.map(v => v.dataValues);
        res.render('listarVacinas', { vacinas });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar vacinas');
    }
});


app.get('/vacinas/cadastrar', async (req, res) => {
    res.render('cadastrarVacinas');
});

app.post('/vacinas/cadastrar', async (req, res) => {
    try {
        let { animalId, funcionarioId, tipoVacina, dataAplicacao, proximaDose } = req.body;
        await Vacina.create({
            animalId:
            animal.nome.body,
            funcionarioId: funcionarioId || null,
            tipoVacina,
            dataAplicacao,
            proximaDose
        });
        res.redirect('/vacinas');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar vacina');
    }
});

app.get('/vacinas/editar/:id', async (req, res) => {
    try {
        let vacina = await Vacina.findByPk(req.params.id);
        let animais = await Animal.findAll();
        let funcionarios = await Funcionario.findAll();
        res.render('editarVacina', { vacina, animais, funcionarios });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar vacina');
    }
});

app.post('/vacinas/editar/:id', async (req, res) => {
    const { nome, tipo, descricao, dataAplicacao } = req.body;
    try {
        await Vacina.update({
        animalId,
        funcionarioId: funcionarioId || null,
        tipoVacina,
        dataAplicacao,
        proximaDose
    }, {
        where: { id: req.params.id }
    });

        res.redirect('/vacinas');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar vacina');
    }
});

app.get('/vacinas/deletar/:id', async (req, res) => {
    try {
        await Vacina.destroy({
            where: { id: req.params.id }
        });
        res.redirect('/vacinas');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao deletar vacina');
    }
});

app.get('/vacinas/:id', async (req, res) => {
    try {
        let vacina = await Vacina.findByPk(req.params.id);
        if(!vacina)
            return res.status(404).send('Vacina não encontrada');
        res.render('detalharVacinas', { vacina: vacina.dataValues });
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar vacina');
    }
});

app.listen(port, () => {
    console.log(`Servidor em execução: http://localhost:${port}`);
});