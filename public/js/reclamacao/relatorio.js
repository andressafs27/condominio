document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtro_codigo").disabled = true;
    document.getElementById("btnExportarExcel").addEventListener("click", exportarExcel);

    let filtroEscolhido = 0;
    document.getElementById("btnFiltrar").addEventListener("click", buscar);

    // let itemFiltro = document.querySelectorAll(".itemFiltro");
    // for (let i = 0; i < itemFiltro.length; i++) {
    //     itemFiltro[i].addEventListener("click", mudarCriterioFiltragem);
    // }

    document.getElementById("filtroSelect").addEventListener("change", mudarCriterioFiltragem);

    function buscar() {
        let termoFiltro = document.getElementById("filtro_codigo").value;
        let startDate = document.getElementById("startDate").value;
        let endDate = document.getElementById("endDate").value;
        let categoriaId = document.getElementById("filtroSelectCategoria").value;

        termoFiltro = termoFiltro ? termoFiltro : '0';
        if(filtroEscolhido == 5) {
            termoFiltro = categoriaId;
        }

        let url = `/reclamacao/filtrar/${termoFiltro}/${filtroEscolhido}`;
        if (filtroEscolhido == 7) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        fetch(url)
            .then(r => r.json())
            .then(r => {
                let htmlCorpo = "";
                if (r.length > 0) {
                    for (let i = 0; i < r.length; i++) {
                        htmlCorpo += `
                            <tr>
                                <td>${r[i].id}</td>
                                <td>${new Date(r[i].data).toLocaleString()}</td>
                                <td>${r[i].descricao}</td>
                                <td>${r[i].status}</td>
                                <td>${r[i].categoria_nome}</td>
                            </tr>
                        `;
                    }
                } else {
                    htmlCorpo = "<tr><td colspan='6'>A pesquisa não retornou resultados</td></tr>";
                }
                document.querySelector("#tabelaReclamacoes > tbody").innerHTML = htmlCorpo;
            });
    }

    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaReclamacoes"));
        XLSX.writeFile(wb, "relatorio-reclamacoes.xlsx");
    }

    function mudarCriterioFiltragem() {
        filtroEscolhido = this.value;
        document.getElementById("filtro_codigo").disabled = filtroEscolhido != 1;
        if(filtroEscolhido != 1) {
            document.getElementById("filtro_codigo").value = '';
        }
        document.getElementById("dateFilter").style.display = filtroEscolhido == 7 ? null : 'none';
        document.getElementById("categoriaFilter").style.display = filtroEscolhido == 5 ? null : 'none';
    }
});