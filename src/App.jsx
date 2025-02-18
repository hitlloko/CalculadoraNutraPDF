import { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./styles.css";

function App() {
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [carrinho, setCarrinho] = useState([]);
    const [nomeComprador, setNomeComprador] = useState(""); // Novo estado para o nome do comprador

    const produtos = {
        "Bálsamo": 38.00,
        "Cálcio Litho D": 54.95,
        "Coconut - óleo de coco": 49.95,
        "Colágeno com Vit. A, C, D e E": 49.95,
        "DGT": 54.95,
        "Dolmag": 39.95,
        "Fily": 54.95,
        "Fily-F": 54.95,
        "Nutra Ferr - Ferro C": 49.95,
        "Fossin": 54.95,
        "Gold Summer": 54.95,
        "Hair, Skin & Nails": 59.95,
        "Issoy com Vit. A, C, D e E": 54.95,
        "Kohle": 44.95,
        "Linhol - óleo de linhaça": 49.95,
        "Magnésio": 39.95,
        "Nutra B": 44.95,
        "Nutra D3": 44.95,
        "Nutra C": 49.95,
        "Nutra 12C": 59.95,
        "Nutra Folic": 49.95,
        "Nutra Off 5mg": 49.95,
        "Nutra Off 10mg": 54.95,
        "Nutra Q10": 49.95,
        "Nutra Kalio": 49.95,
        "Nutra Oxy": 49.95,
        "Nutralina": 54.95,
        "Nutra Mint": 49.90,
        "Nutrium": 54.95,
        "Nutrox - refil": 90.00,
        "Ômega 3": 0.00,
        "Onagra - óleo de prímula": 49.95,
        "Provit C": 54.95,
        "Provit Pó": 54.95,
        "Ocitem": 54.95,
        "Ocitem Premium": 69.95,
        "Quitonato": 49.95,
        "Shake pote": 0.00,
        "Shake refil": 89.95,
        "Solux caps": 44.95,
        "Solux fibras": 59.95,
        "Solux pó": 44.95,
        "THO": 59.95,
        "TMA": 59.95,
        "TRG": 0.00,
        "Triptofenil": 54.95,
        "Tumer": 54.95,
        "Veribel": 54.95,
        "Vizevit": 54.95,
        "Cálcio Litho D Kids": 49.95,
        "Nutra B Kids": 49.95,
        "Nutra 12C Kids": 49.95,
        "Nutra C Kids": 44.95,
        "Nutra D3 Kids": 44.95,
        "Nutra Folic Kids": 49.95,
        "Provit C Kids": 49.95,
        "Quitonato Kids": 49.95
    };

    const salvarComoJSON = () => {
        if (!nomeComprador) {
            alert("Por favor, insira o nome do comprador.");
            return;
        }
    
        const dataHoraLocal = new Date().toLocaleString();
        const dados = {
            comprador: nomeComprador,
            dataHora: dataHoraLocal,
            carrinho: carrinho.map(item => ({
                produto: item.nome,
                quantidade: item.quantidade,
                preco: produtos[item.nome],
                total: (produtos[item.nome] * item.quantidade).toFixed(2)
            })),
            total: calcularTotal().toFixed(2)
        };
    
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
        saveAs(blob, "carrinho.json");
    };

    const adicionarProduto = () => {
        if (produtoSelecionado && quantidade > 0) {
            setCarrinho([...carrinho, { nome: produtoSelecionado, quantidade }]);
            setProdutoSelecionado(""); // Resetar seleção
            setQuantidade(1); // Resetar quantidade
        }
    };

    const removerProduto = (index) => {
        const novoCarrinho = carrinho.filter((_, i) => i !== index);
        setCarrinho(novoCarrinho);
    };

    const calcularTotal = () => {
        return carrinho.reduce((total, item) => total + produtos[item.nome] * item.quantidade, 0);
    };

    const gerarPDF = () => {
        const doc = new jsPDF();
        const dataHoraLocal = new Date().toLocaleString(); // Pegar a data e hora local
        doc.text("Lista de Produtos", 10, 10);

        // Adicionar nome do comprador e data/hora no PDF
        doc.text(`Comprador: ${nomeComprador}`, 10, 20);
        doc.text(`Data e Hora: ${dataHoraLocal}`, 10, 30);

        carrinho.forEach((item, index) => {
            const texto = `${item.quantidade}x ${item.nome} - R$ ${(produtos[item.nome] * item.quantidade).toFixed(2)}`;
            doc.text(texto, 10, 40 + index * 10);
        });

        doc.text(`Total: R$ ${calcularTotal().toFixed(2)}`, 10, 40 + carrinho.length * 10 + 10);
        doc.save("calculado.pdf");
    };

    const exportarParaExcel = (carrinho, nomeComprador) => {
        if (carrinho.length === 0) {
            alert("Adicione produtos antes de exportar!");
            return;
        }

        const dataHoraLocal = new Date().toLocaleString(); // Obtém a data e hora local

        // Criando a primeira linha com informações do comprador e data
        const dados = [
            { Produto: `Comprador: ${nomeComprador}`, Quantidade: "", Preço_Unitário: "", Total: "" },
            { Produto: `Data e Hora: ${dataHoraLocal}`, Quantidade: "", Preço_Unitário: "", Total: "" },
            {}, // Linha vazia para separar
            ...carrinho.map((item) => ({
                Produto: item.nome,
                Quantidade: item.quantidade,
                Preço_Unitário: produtos[item.nome],
                Total: (produtos[item.nome] * item.quantidade).toFixed(2),
            })),
        ];

        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Carrinho");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "Carrinho.xlsx");
    };




    return (
        <div className="p-4">
            <h2 className="mb-4 font-bold text-lg">Adicionar Produtos</h2>

            <label htmlFor="produtos" className="prod"></label>
            <select
                id="produtos"
                name="produtos"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                className="border p-2 ml-2"
            >
                <option value="">Selecione...</option>
                {Object.keys(produtos).map((produto) => (
                    <option key={produto} value={produto}>
                        {produto}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="border p-2 ml-2"
            />

            <button onClick={adicionarProduto} className="bg-green-500 text-white p-2 ml-2 botao">
                Adicionar Produto
            </button>


            <h3 className="mt-4 font-bold">Lista do Cálculo</h3>
            <ul className="list-disc ml-6">
                {carrinho.map((item, index) => (
                    <li key={index} className="flex justify-between items-center itemcar">
                        {item.quantidade}x {item.nome} - R$ {(produtos[item.nome] * item.quantidade).toFixed(2)}
                        <button
                            onClick={() => removerProduto(index)}
                            className="bg-red-500 text-white p-1 ml-2 excluirbutton"
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>

            <h3 className="mt-4 font-bold">Total: R$ {calcularTotal().toFixed(2)}</h3>

            {/* Campo de input para o nome do comprador */}
            <div className="mt-4">
                <label htmlFor="nomeComprador" className="font-bold labelCN"><p>Nome do Comprador:</p></label>
                <input
                    type="text"
                    id="nomeComprador"
                    value={nomeComprador}
                    onChange={(e) => setNomeComprador(e.target.value)}
                    className="border p-2 ml-2 inputComprador"
                />
            </div>

            <button onClick={gerarPDF} className="bg-blue-500 text-white p-2 mt-4">
                Gerar PDF
            </button>

            <button onClick={() => exportarParaExcel(carrinho, nomeComprador)} className="bg-green-500 text-white p-2 mt-4 ml-2">
                Gerar Excel
            </button>

            <button onClick={salvarComoJSON} className="bg-yellow-500 text-white p-2 mt-4">
    Salvar em JSON
</button>


        </div>
    );
}

export default App;
