const modal         = document.querySelector('.modal-container')
const sId           = document.querySelector('#m-id')
const sNome         = document.querySelector('#m-nome')
const sQuantidade   = document.querySelector('#m-quantidade')
const sValor        = document.querySelector('#m-valor')
const sdataValidade = document.querySelector('#m-data')

var cboFiltro     = document.getElementById("cboFiltro");
var filtroId      = document.getElementById("filtroId");

filtroId.disabled = true; 

function selecionaFiltro(){
  if( cboFiltro.value == 'id' ) {
    filtroId.disabled = false;
    filtroId.focus();
  }else{
    filtroId.disabled = true;
    document.getElementById("filtroId").value = 0;
    window.location.reload(); // dando um refresh na pagina.
  }
}

function openModal( vdados ) {

  sId.value = vdados[0];
  sNome.value = vdados[1];
  sQuantidade.value = vdados[2];
  sValor.value = vdados[3];
  sdataValidade.value = vdados[4];
   
  // ativa o modal.
  modal.classList.add('active')

  // ao clicar no salvar.
  modal.onclick = e => {  
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  } 

}

btnSalvar.onclick = e => {

  let inputId           = document.getElementById("m-id").value;
  let inputNome         = document.getElementById("m-nome").value;
  let inputValor        = document.getElementById("m-valor").value;
  let inputQuantidade   = document.getElementById("m-quantidade").value;
  let inputDataValidade = document.getElementById("m-data").value;

  let valorFormatado    = inputValor.toString().split('R$').reverse().join('').replace(",",".");

  if ( inputNome === '' ) {
    alert("Escreva o nome de um item!");
  } else if ( valorFormatado === '' ) {
    alert("O valor e obrigatório!");    
  } else if( inputDataValidade === '' ) {
    alert("A data de validade precisa ser informada!");
  } else if (  isNaN( inputQuantidade ) || inputQuantidade === '' ) {
    alert("Quantidade precisa ter números!");    
  } else {
    updateItemProduto( inputId, inputNome, inputQuantidade, valorFormatado, inputDataValidade )
    /*
    coloquei e.preventDefault() e ai resolveu o Error: Failed to fetch.
    */
    e.preventDefault()  
  }

}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListProduto = async () => {    
    let url = 'http://127.0.0.1:5000/produtos';    
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertListProduto(item.id, item.nome, item.quantidade, item.valor, item.data_validade));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getListProduto()
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItemProduto = async (inputProduct, inputQuantity, inputPrice, dataFormatada) => {
    
    const formData = new FormData();
    
    formData.append('nome', inputProduct);
    formData.append('quantidade', inputQuantity);
    formData.append('valor', inputPrice);
    formData.append('data_validade', dataFormatada);
    let id_pro = 0;

    let url = 'http://127.0.0.1:5000/produto';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then( data => {
      if (!data.ok) {
        if( data.status == 409 ) {
          alert( 'Produto já existe na base.')
          return;
        }
      }
      return data.json();
    })
    .then( produto => {
      id_pro = produto.id;  // Pegando o id inserido.
      alert( "Produto inserido com sucesso!");
      insertListProduto( id_pro, inputProduct, inputQuantity, inputPrice, dataFormatada );
    })
    .catch( err => {
      alert( err )
    });
    
  }

  /*
    --------------------------------------------------------------------------------------
    Função para alterar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
    const updateItemProduto = async ( uId, uNome, uQuantidade, uValor, udataValidade ) => {
    
      const formData = new FormData();
      var result = Boolean(true);
      
      formData.append('id', uId);
      formData.append('nome', uNome);
      formData.append('quantidade', uQuantidade);
      formData.append('valor', uValor);
      formData.append('data_validade', udataValidade);

      let url = 'http://127.0.0.1:5000/update_produto';
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then( data => {
        if( data.status != 200 ) {
          result = Boolean(false);            
          if( data.status == 404 ) {
            msg = 'Produto não encontrado na base.';
          } else if( data.status == 409 ) {
            msg = 'Produto de mesmo nome já salvo na base.';
          } else if( data.status == 400 ) {
            msg = 'Não foi possivel salvar um novo Grupo.';            
          }
          alert( msg )  
        }
        return data.json();
      })
      .then( produto => {
        if( result ){
          alert( "Produto alterado com sucesso!");
          modal.classList.remove('active')   // fechando o Modal
          window.location.reload(); // dando um refresh na pagina.
        }  
      })
      .catch( err => {
        alert( err )
      });        
  
    }
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão update para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButUpdate = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00AB");
    span.className = "update";
    span.appendChild(txt);
    parent.appendChild(span);
  }
      
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const idItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()          
          deleteItem(idItem)
          alert("Removido!")
        }
      }
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para alterar um item da lista de acordo com o click no botão update
    --------------------------------------------------------------------------------------
  */
  const updateElement = () => {
    let update = document.getElementsByClassName("update");
    let i;
    let vdados = [];
    let carac = "&nbsp;"
    for (i = 0; i < update.length; i++) {
      update[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const id = div.getElementsByTagName('td')[0].innerHTML
        const nome = div.getElementsByTagName('td')[1].innerHTML
        const quantidade = div.getElementsByTagName('td')[2].innerHTML
        const valor = div.getElementsByTagName('td')[3].innerHTML.replace(carac, "" )
        const dataValidade = div.getElementsByTagName('td')[4].innerHTML                
        vdados = [ id, nome, quantidade, valor, dataValidade ];        
        openModal( vdados )           
      }
    }
  }

/*
    --------------------------------------------------------------------------------------
    Função para buscar por id via GET
    --------------------------------------------------------------------------------------
  */
    const getProdutoPorId = (id_item) => {
    
      var result = Boolean(true);

      let url = 'http://127.0.0.1:5000/produto?produto_id=' + id_item;    
      
      fetch(url, {
        method: 'get'
      })
      .then( response => {
        if( response.status != 200 ){
          result = Boolean(false);
          if( response.status == 404 ){
            msg = 'Produto não encontrado na base.';
          }   
          alert( msg )    
        }
        return response.json();
      })
      .then( data => {
        if ( result ){
          limpaTabela();
          insertListProduto( data.id, data.nome, data.quantidade, data.valor, data.data_validade );
        }
      })
      .catch( err => {
        alert( err );
      });
    } 

  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItemProduto = (id_item) => {
    
    let url = 'http://127.0.0.1:5000/produto?produto_id=' + id_item;    
    
    fetch(url, {
      method: 'delete'
    })
    .then((response) => response.json())
    .catch( err => {
      alert( err )
    });
  
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade, valor e data de validade
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {

    let inputProduct = document.getElementById("newInput").value;
    let inputQuantity = document.getElementById("newQuantity").value;
    let inputPrice = document.getElementById("newPrice").value;
    let inputNewDate = document.getElementById("newDate").value;

    let dataFormatada = inputNewDate.split('-').reverse().join('/');
    let valorFormatado = inputPrice.toString().split('R$').reverse().join('').replace(",",".");
    
    if (inputProduct === '') {
      alert("Escreva o nome de um item!");
    } else if ( isNaN(inputQuantity) || inputQuantity === '' ) {
      alert("Quantidade precisa ter números!");
    } else if( valorFormatado === ''){
      alert("O valor e obrigatório!");
    } else if( inputNewDate === ''){
      alert("A data de validade precisa ser informada!");
    } else {
      postItemProduto(inputProduct, inputQuantity, valorFormatado, dataFormatada)
    }
  }
    
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertListProduto = (id,nameProduct, quantity, price, data ) => {
    var item = [id,nameProduct, quantity, price, data ]
    var table = document.getElementById('myTable');
  
    var row = table.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    insertButton(row.insertCell(-1))
    insertButUpdate(row.insertCell(-1))

    document.getElementById("newInput").value = "";
    document.getElementById("newQuantity").value = "";
    document.getElementById("newPrice").value = "";
    document.getElementById("newDate").value = "";
    
    removeElement()
    updateElement()
    
  }

  function BuscaPorId(item){
    if( item == ''){
      alert( 'Favor informar um Id')
      return;
    }
    getProdutoPorId(item)
  }  

  function limpaTabela(){
    var tb = document.getElementById('myTable');
    while(tb.rows.length > 1) {
      tb.deleteRow(1);
    }    
  }


