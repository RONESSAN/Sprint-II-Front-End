const modal       = document.querySelector('.modal-container')
const sId         = document.querySelector('#m-id')
const sDescricao  = document.querySelector('#m-descricao')

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
  sDescricao.value = vdados[1];
   
  // ativa o modal.
  modal.classList.add('active')
  
  // ao clicar no salvar
  modal.onclick = e => {  
    if (e.target.className.indexOf('modal-container') != -1) {
      modal.classList.remove('active')
    }
  } 

}

btnSalvar.onclick = e => {
  
  let inputId         = document.getElementById("m-id").value;
  let inputDescricao  = document.getElementById("m-descricao").value;

  if ( inputDescricao === " " ) {
    alert("Escreva o nome da marca!");
  } else {
    updateMarca( inputId, inputDescricao )
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
const getList = async () => {    
    let url = 'http://127.0.0.1:5000/marcas';    
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      data.marcas.forEach(item => insertListMarca(item.id, item.descricao ) );
    })
    .catch( err => {
      alert( err )
    });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um usuario na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postMarca = async (inputDescricao) => {
    
    const formData = new FormData();
    var result = Boolean(true);
    
    formData.append('descricao', inputDescricao);
    
    let url = 'http://127.0.0.1:5000/marca';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then( data => {
      if( data.status != 200){
        result = Boolean(false);
        if( data.status == 409 ) {
          msg = 'Marca já existe na Base.';
        }else if( data.status == 400 ){
          msg = 'Não foi possivel salvar um nova Marca.';
        }
        alert( msg )
      }  
      return data.json();
    })
    .then( marca => {
      if( result ) {
        alert( 'Marca inserida com sucesso!');
        insertListMarca( marca.id, inputDescricao )
      }
    })
    .catch( err => {
      alert( "Error: " + err.message )
    }); 

  }

  /*
    --------------------------------------------------------------------------------------
    Função para alterar um grupo na lista do servidor via requisição PUT
    --------------------------------------------------------------------------------------
  */ 
    const updateMarca = async ( inputId, inputDescricao ) => {
    
      const formData = new FormData();
      var result = Boolean(true);
      
      formData.append('id', inputId);
      formData.append('descricao', inputDescricao);
    
      let url = 'http://127.0.0.1:5000/updateMarca';
      fetch(url, {
        method: 'PUT',
        body: formData
      })
      .then( data => {
        if( data.status != 200 ){
          result = Boolean(false);          
          if( data.status == 409 ) {
            msg = 'Marca já existe na Base.';
          }else if( data.status == 404 ) {
            msg = 'Marca não encontrada na base.';
          }else if( data.status == 400 ) {
            msg = 'Não foi possivel salvar um nova Marca.';
          }
          alert( msg )  
        }
        return data.json();
      })
      .then( grupo => {
        if( result ){
          alert( 'Marca alterada com sucesso!');
          modal.classList.remove('active')   // fechando o Modal
          //insertListGrupo(inputId, inputDescricao, inputMargem )
          window.location.reload(); // dando um refresh na pagina.
        }
      })
      .catch( err => {
        alert( "Error: " + err.message )
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
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const idItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()          
          deleteMarca(idItem)
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
      for (i = 0; i < update.length; i++) {
        update[i].onclick = function () {
          let div          = this.parentElement.parentElement;
          let id           = div.getElementsByTagName('td')[0].innerHTML
          let descricao    = div.getElementsByTagName('td')[1].innerHTML
          vdados = [ id, descricao ]; 
          openModal( vdados )  
        }
      }
    }
  
  /*
    --------------------------------------------------------------------------------------
    Função para buscar por id via GET
    --------------------------------------------------------------------------------------
  */
    const getMarcaPorId = (id_item) => {
    
      var result = Boolean(true);

      let url = 'http://127.0.0.1:5000/marca?marca_id=' + id_item;    
      
      fetch(url, {
        method: 'get'
      })
      .then( response => {
        if( response.status != 200 ){
          result = Boolean(false);
          if( response.status == 404 ){
            msg = 'Marca não encontrada na base.';
          }   
          alert( msg )    
        }
        return response.json();
      })
      .then( data => {
        if ( result ){
          limpaTabela();
          insertListMarca( data.id, data.descricao );
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
  const deleteMarca = (id_marca) => {
    
    let url = 'http://127.0.0.1:5000/marca?marca_id=' + id_marca;    
    
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
 
  const newItemMarca = () => {

    let inputDescricao = document.getElementById("inputDescricao").value;
    
    if (inputDescricao === '') {
      alert("Digite o nome da Marca!");
      return
    } else {
      postMarca( inputDescricao ) 
    }    

  }
 
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertListMarca = ( id, descricao ) => {
    var item = [id, descricao]
    var table = document.getElementById('myTable');
  
    var row = table.insertRow();    
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    
    insertButton(row.insertCell(-1))
    insertButUpdate(row.insertCell(-1))

    document.getElementById("inputDescricao").value = "";

    removeElement()
    updateElement()    

  }

  function BuscaPorId(item){
    if( item == ''){
      alert( 'Favor informar um Id')
      return;
    }
    getMarcaPorId(item)
  }  

  function limpaTabela(){
    var tb = document.getElementById('myTable');
    while(tb.rows.length > 1) {
      tb.deleteRow(1);
    }    
  }
