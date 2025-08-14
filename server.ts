import validar from "validation-br";
import cep from "cep-promise";
import express from "express";

const app = express();
const port = 3004;


interface IPessoa {
    cpf:string;
    nome: string;
    rg: number;
}

interface IEndereco {
    cep: number;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface ICliente extends IPessoa, IEndereco {
    email: string;
}

let clientes: ICliente[] = [
    {
        cpf: "12345678901",
        nome: "João Silva",
        rg: 123456789,
        cep: 84033106,
        logradouro: "Rua A",
        bairro: "PQ Pinheiros",
        localidade: "Ponta Grossa",
        uf: "PR",
        email: "joao.silva@example.com"
    },
    {
        cpf: "98765432100",
        nome: "Maria Oliveira",
        rg: 987654321,
        cep: 84033107,
        logradouro: "Rua B",
        bairro: "PQ Pinheiros",
        localidade: "Ponta Grossa",
        uf: "PR",
        email: "maria.oliveira@example.com"
    },
    {
        cpf: "12312312312",
        nome: "Carlos Souza",
        rg: 123123123,
        cep: 84033108,
        logradouro: "Rua C",
        bairro: "PQ Pinheiros",
        localidade: "Ponta Grossa",
        uf: "PR",
        email: "carlos.souza@example.com"
    }
];

app.get("/", (req, res) => {
  res.send("API de validação de CPF, CNPJ e CEP");
});

app.get("/valida-cpf/:cpf", async (req, res) => {
  const cpfValue = await validar.isCPF(req.params.cpf);

  if (cpfValue) {
    res.send("CPF válido!");
  } else {
    res.status(400).json({ error: "CPF inválido!" });
  }
});

app.get("/valida-cnpj/:cnpj", async (req, res) => {
  const cnpjValue = await validar.isCNPJ(req.params.cnpj);

  if (cnpjValue) {
    res.send("CNPJ válido!");
  } else {
    res.status(400).json({ error: "CNPJ inválido!" });
  }
});

app.get("/valida-cnh/:cnh", async (req, res) => {
    const cnhValue = await validar.isCNH(req.params.cnh);

    if (cnhValue) {
        res.send("CNH válida!");
    } else {
        res.status(400).json({ error: "CNH inválida!" });
    }
});

app.get("/valida-cep/:cep", async (req, res) => {
  const cepValue = await cep(req.params.cep);

  if (cepValue) {
    res.send("CEP valido!");
  } else {
    res.status(400).json({ error: "Erro ao buscar CEP" });
  }
});

app.get("/clientes", (req, res) => {
  res.json(clientes);
});

app.get("/clientes/:cpf", (req, res) => {
  const cliente = clientes.find(IClientes => IClientes.cpf === String(req.params.cpf));
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});

app.post("/clientes", express.json(), (req, res) => {
    const novoCliente: ICliente = req.body;

    // Validação simples
    if (!novoCliente.cpf || !novoCliente.nome || !novoCliente.email) {
        return res.status(400).json({ error: "Dados incompletos" });
    }

    clientes.push(novoCliente);
    res.status(201).json(novoCliente);
});

app.delete("/clientes/:cpf", (req, res) => {
  const { cpf } = req.params;
  clientes = clientes.filter(cliente => cliente.cpf !== String(cpf));
  res.status(204).send();
});

app.put("/clientes/:cpf", express.json(), (req, res) => {
    const { cpf } = req.params;
    const clienteIndex = clientes.findIndex(cliente => cliente.cpf === String(cpf));

    if (clienteIndex !== -1) {
        const clienteAtualizado = { ...clientes[clienteIndex], ...req.body };
        clientes[clienteIndex] = clienteAtualizado;
        res.json(clienteAtualizado);
    } else {
        res.status(404).json({ error: "Cliente não encontrado" });
    }
});

clientes.push({
        cpf: "09632146913",
        nome: "Johnatan",
        rg: 987654321,
        cep: 84033107,
        logradouro: "Rua T",
        bairro: "PQ Pinheiros",
        localidade: "Ponta Grossa",
        uf: "PR",
        email: "johnatan@example.com"
    }
);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});