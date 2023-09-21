const modal       = document.querySelector('.modal-container')
const sId         = document.querySelector('#m-id')
const sDescricao  = document.querySelector('#m-descricao')
const sMargem     = document.querySelector('#m-margem')

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
  sMargem.value = vdados[2];
   
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
  let inputMargem     = document.getElementById("m-margem").value;

  let margemFormatada  = inputMargem.toString().split('%').reverse().join('').replace(",",".");

  if ( inputDescricao === " " ) {
    alert("Escreva o nome do grupo!");
  } else {
    updateGrupo ( inputId, inputDescricao, margemFormatada )
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
    let url = 'http://127.0.0.1:5000/grupos';    
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      data.grupos.forEach(item => insertListGrupo(item.id, item.descricao, item.margem ) );
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
  const postGrupo = async (inputDescricao, inputMargem) => {
    
    const formData = new FormData();
    var result = Boolean(true);

    formData.append('descricao', inputDescricao);
    formData.append('margem', inputMargem );
    
    let url = 'http://127.0.0.1:5000/grupo';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then( data => {
      if( data.status != 200){
        result = Boolean(false);
        if( data.status == 409 ) {
          msg = 'Grupo já existe na Base.';
        }else if( data.status == 400 ){
          msg = 'Não foi possivel salvar um novo Grupo.';
        }
        alert( msg )
      }  
      return data.json();
    })
    .then( grupo => {
      if( result ) {
        alert( 'Grupo inserido com sucesso!');
        insertListGrupo(grupo.id, inputDescricao, inputMargem )
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
    const updateGrupo = async ( inputId, inputDescricao, inputMargem ) => {
    
      const formData = new FormData();
      var result = Boolean(true);
      
      formData.append('id', inputId);
      formData.append('descricao', inputDescricao);
      formData.append('margem', inputMargem);

      let url = 'http://127.0.0.1:5000/updateGrupo';
      fetch(url, {
        method: 'PUT',
        body: formData
      })
      .then( data => {
        if( data.status != 200 ){
          result = Boolean(false);          
          if( data.status == 409 ) {
            msg = 'Grupo já existe na Base.';
          }else if( data.status == 404 ) {
            msg = 'Grupo não encontrado na base.';
          }else if( data.status == 400 ) {
            msg = 'Não foi possivel salvar um novo Grupo.';
          }
          alert( msg )  
        }
        return data.json();
      })
      .then( grupo => {
        if( result ){
          alert( 'Grupo alterado com sucesso!');
          modal.classList.remove('active')   // fechando o Modal
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
          deleteGrupo(idItem)
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
          let margem       = div.getElementsByTagName('td')[2].innerHTML
          vdados = [ id, descricao, margem ]; 
          openModal( vdados )  
        }
      }
    }
  
  /*
    --------------------------------------------------------------------------------------
    Função para buscar por id via GET
    --------------------------------------------------------------------------------------
  */
    const getGrupoPorId = (id_item) => {
    
      var result = Boolean(true);

      let url = 'http://127.0.0.1:5000/grupo?grupo_id=' + id_item;    
      
      fetch(url, {
        method: 'get'
      })
      .then( response => {
        if( response.status != 200 ){
          result = Boolean(false);
          if( response.status == 404 ){
            msg = 'Grupo não encontrado na base.';
          }   
          alert( msg )    
        }
        return response.json();
      })
      .then( data => {
        if ( result ){
          limpaTabela();
          insertListGrupo( data.id, data.descricao, data.margem );
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
  const deleteGrupo = (id_grupo) => {
    
    let url = 'http://127.0.0.1:5000/grupo?grupo_id=' + id_grupo;    
    
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
 
  const newItemGrupo = () => {

    let inputDescricao = document.getElementById("inputDescricao").value;
    let inputMargem    = document.getElementById("inputMargem").value;
    
    let margemFormatada  = inputMargem.toString().split('%').reverse().join('').replace(",",".");

    if (inputDescricao === '') {
      alert("Digite o nome do Grupo!");
      return
    } else {
      postGrupo(inputDescricao, margemFormatada ) 
    }    

  }
 
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertListGrupo = ( id, descricao, margem ) => {
    var item = [id, descricao, margem]
    var table = document.getElementById('myTable');
  
    var row = table.insertRow();    
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    
    insertButton(row.insertCell(-1))
    insertButUpdate(row.insertCell(-1))

    document.getElementById("inputDescricao").value = "";
    document.getElementById("inputMargem").value = "";
    
    removeElement()
    updateElement()    

  }

  function BuscaPorId(item){
    if( item == ''){
      alert( 'Favor informar um Id')
      return;
    }
    getGrupoPorId(item)
  }  

  function limpaTabela(){
    var tb = document.getElementById('myTable');
    while(tb.rows.length > 1) {
      tb.deleteRow(1);
    }    
  }
