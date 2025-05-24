document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtro_codigo").disabled = true;
    document.getElementById("btnExportarExcel").addEventListener("click", exportarExcel);

    let filtroEscolhido = 0;
    document.getElementById("btnFiltrar").addEventListener("click", buscar);

    document.getElementById("filtroSelect").addEventListener("change", mudarCriterioFiltragem);

    function buscar() {
        let termoFiltro = document.getElementById("filtro_codigo").value;

        termoFiltro = termoFiltro ? termoFiltro : '0';

        let url = `/pessoa/filtrar/${termoFiltro}/${filtroEscolhido}`;

        fetch(url)
            .then(r => r.json())
            .then(r => {
                let htmlCorpo = "";
                if (r.length > 0) {
                    for (let i = 0; i < r.length; i++) {
                        htmlCorpo += `
                            <tr>
                                <td>${r[i].id}</td>
                                <td>${r[i].nome}</td>
                                <td>${r[i].cpf}</td>
                                <td>${r[i].bloco_numero}</td>
                                <td>${r[i].unidade_numero}</td>
                                
                            </tr>
                        `;
                    }
                } else {
                    htmlCorpo = "<tr><td colspan='6'>A pesquisa não retornou resultados</td></tr>";
                }
                document.querySelector("#tabelaPessoa > tbody").innerHTML = htmlCorpo;
            });
    }

    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPessoa"));
        XLSX.writeFile(wb, "relatorio-pessoa.xlsx");
    }

    function mudarCriterioFiltragem() {
        filtroEscolhido = this.value;
        document.getElementById("filtro_codigo").disabled = filtroEscolhido == 6;
        if(filtroEscolhido == 6) {
            document.getElementById("filtro_codigo").value = '';
        }
    }
});