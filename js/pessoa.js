const modal         = document.querySelector('.modal-container')
const sId           = document.querySelector('#m-id')
const sCpf          = document.querySelector('#m-cpf')
const sNome         = document.querySelector('#m-nome')
const sCep          = document.querySelector('#m-cep')
const sLogradouro   = document.querySelector('#m-logradouro')
const sComplemento  = document.querySelector('#m-complemento')
const sNumero       = document.querySelector('#m-numero')
const sBairro       = document.querySelector('#m-bairro')
const sCidade       = document.querySelector('#m-cidade')
const sUf           = document.querySelector('#m-uf')
const sIbge         = document.querySelector('#m-ibge')

var cboFiltro       = document.getElementById("cboFiltro");
var filtroId        = document.getElementById("filtroId");

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

function openModalPessoa( vdados ) {

  sId.value = vdados[0];
  sCpf.value = vdados[1];
  sNome.value = vdados[2];
  sCep.value = vdados[3];
  sLogradouro.value = vdados[4];
  sComplemento.value = vdados[5];
  sNumero.value = vdados[6];
  sBairro.value = vdados[7];
  sCidade.value = vdados[8];
  sUf.value = vdados[9];
  sIbge.value = vdados[10];

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
  let inputCpf          = document.getElementById("m-cpf").value;
  let inputNome         = document.getElementById("m-nome").value;
  let inputCep          = document.getElementById("m-cep").value;
  let inputLogradouro   = document.getElementById("m-logradouro").value;
  let inputComplemento  = document.getElementById("m-complemento").value;
  let inputNumero       = document.getElementById("m-numero").value;
  let inputBairro       = document.getElementById("m-bairro").value;
  let inputCidade       = document.getElementById("m-cidade").value;
  let inputUf           = document.getElementById("m-uf").value;
  let inputIbge         = document.getElementById("m-ibge").value;

  if ( inputCpf === '' ) {
    alert("Favor informar o CPF, e obrigatório!");
    return;
  } else if( inputNome === '' ) {
    alert("Favor informar a Pessoa!");
    return;
  } else {
    updateItemPessoa( inputId, inputCpf, inputNome, inputCep, inputLogradouro, inputComplemento,
                      inputNumero, inputBairro, inputCidade, inputUf, inputIbge );
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
const getListPessoa = async () => {    
    let url = 'http://127.0.0.1:5000/pessoas';    
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      data.pessoas.forEach(item => 
      insertListPessoa( item.id, item.cpf, item.nome, item.cep, item.logradouro, item.complemento,
                        item.numero, item.bairro, item.cidade, item.uf, item.ibge) );
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
  --------------------------------------------------------------------------------------
  Função inicial da pagina-chamando um get de todas as pessoas.
  --------------------------------------------------------------------------------------
  */
  getListPessoa()
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItemPessoa = async (inputCpf, inputNome, inputCep, inputLogradouro, inputComplemento,
                                inputNumero, inputBairro, inputCidade, inputUf, inputIbge) => {
    
    const formData = new FormData();
    var result = Boolean(true);
    
    formData.append('cpf', inputCpf);
    formData.append('nome', inputNome);
    formData.append('cep', inputCep);
    formData.append('logradouro', inputLogradouro);
    formData.append('complemento', inputComplemento);
    formData.append('numero', inputNumero);
    formData.append('bairro', inputBairro);
    formData.append('cidade', inputCidade);
    formData.append('uf', inputUf);
    formData.append('ibge', inputIbge);

    let url = 'http://127.0.0.1:5000/pessoa';
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then( data => {
      if( data.status != 200 ) {
        result = Boolean(false);
        if( data.status == 404 ){
          msg = 'Pessoa não encontrado na base.';
        }else if( data.status == 400 ){
          msg = 'Não foi possivel salvar uma nova pessoa.';
        }else if( data.status == 409 ){
          msg = 'CPF já existe na base.';
        }
        alert( msg )
      }
      return data.json();
    })
    .then( pessoa => {
      if( result ){
        alert( "Pessoa inserida com sucesso!");
        insertListPessoa( pessoa.id, inputCpf, inputNome, inputCep, inputLogradouro, inputComplemento,
                          inputNumero, inputBairro, inputCidade, inputUf, inputIbge );
      }
    })
    .catch( err => {
      alert( err )
    });

  }

  /*
    --------------------------------------------------------------------------------------
    Função para alterar uma pessoa na lista do servidor via requisição PUT
    -------------------------------------------------------------------------------------
  */

  const updateItemPessoa = async ( inputId, inputCpf, inputNome, inputCep, inputLogradouro, inputComplemento,
                                   inputNumero, inputBairro, inputCidade, inputUf, inputIbge ) => {

      const formData = new FormData();
      var result = Boolean(true); 
      
      formData.append('id', inputId);
      formData.append('cpf', inputCpf);
      formData.append('nome', inputNome);
      formData.append('cep', inputCep);
      formData.append('logradouro', inputLogradouro);
      formData.append('complemento', inputComplemento);
      formData.append('numero', inputNumero);
      formData.append('bairro', inputBairro);
      formData.append('cidade', inputCidade);
      formData.append('uf', inputUf);
      formData.append('ibge', inputIbge);                                   

      let url = 'http://127.0.0.1:5000/update_pessoa';
      fetch(url, {
        method: 'PUT',
        body: formData
      })
      .then( data => {
        if( data.status != 200 ){
          result = Boolean(false);          
          if( data.status == 409 ) {
            msg = 'CPF já existe na base de Dados.';
          } else if( data.status == 404 ){
            msg = 'Pessoa não encontrado na base.';
          } else if( data.status == 400 ){
            msg = "Não foi possível salvar uma nova pessoa."          
          }
          alert( msg )
        }  
        return data.json();
      })
      .then( pessoa => {
        if( result ){
          alert( "Pessoa alterada com sucesso!");
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
  const insertButtonPessoa = (parent) => {
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
  const insertButUpdatePessoa = (parent) => {
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
  const removeElementPessoa = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const idItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()          
          deleteItemPessoa(idItem)
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
  const updateElementPessoa = () => {
    let update = document.getElementsByClassName("update");
    let i;
    let vdados = [];
    let carac = "&nbsp;"
    for (i = 0; i < update.length; i++) {
      update[i].onclick = function () {
        let div = this.parentElement.parentElement;        
        const id = div.getElementsByTagName('td')[0].innerHTML
        const cpf = div.getElementsByTagName('td')[1].innerHTML
        const nome = div.getElementsByTagName('td')[2].innerHTML
        const cep =  div.getElementsByTagName('td')[3].innerHTML
        const logradouro = div.getElementsByTagName('td')[4].innerHTML
        const complemento = div.getElementsByTagName('td')[5].innerHTML
        const numero = div.getElementsByTagName('td')[6].innerHTML
        const bairro = div.getElementsByTagName('td')[7].innerHTML
        const cidade = div.getElementsByTagName('td')[8].innerHTML
        const uf = div.getElementsByTagName('td')[9].innerHTML
        const ibge = div.getElementsByTagName('td')[10].innerHTML
        vdados = [ id, cpf, nome, cep, logradouro, complemento, numero, bairro,
                   cidade, uf, ibge ];        
        openModalPessoa( vdados );  
        
      }
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para buscar por id via GET
    --------------------------------------------------------------------------------------
  */
    const getPessoaPorId = (id_item) => {
    
      var result = Boolean(true);

      let url = 'http://127.0.0.1:5000/pessoa?pessoa_id=' + id_item;    
      
      fetch(url, {
        method: 'get'
      })
      .then( response => {
        if( response.status != 200 ){
          result = Boolean(false);
          if( response.status == 404 ){
            msg = 'Pessoa não encontrado na base.';
          }   
          alert( msg )    
        }
        return response.json();
      })
      .then( data => {
        if ( result ){
          limpaTabela();
          insertListPessoa( data.id, data.cpf, data.nome, data.cep, data.logradouro, data.complemento,
            data.numero, data.bairro, data.cidade, data.uf, data.ibge);
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
  const deleteItemPessoa = (id_item) => {
    
    let url = 'http://127.0.0.1:5000/pessoa?pessoa_id=' + id_item;    
    
    fetch(url, {
      method: 'delete'
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um nova pessoa
    --------------------------------------------------------------------------------------
  */
  const newItemPessoa = () => {

    let inputCpf          = document.getElementById("inputCpf").value;
    let inputNome         = document.getElementById("inputNome").value;
    let inputCep          = document.getElementById("inputCep").value;
    let inputLogradouro   = document.getElementById("inputLogradouro").value;
    let inputComplemento  = document.getElementById("inputComplemento").value;
    let inputNumero       = document.getElementById("inputNumero").value;
    let inputBairro       = document.getElementById("inputBairro").value;
    let inputCidade       = document.getElementById("inputCidade").value;
    let inputUf           = document.getElementById("inputUf").value;
    let inputIbge         = document.getElementById("inputIbge").value;
    let ret               = new Boolean(false);
  
    // let dataFormatada = inputNewDate.split('-').reverse().join('/');
    if (inputCpf === '') {
      alert("Favor informar o CPF!");
    } else if ( inputNome === '' ) {
      alert("O nome e obrigatorio!");
    } else {
      postItemPessoa( inputCpf, inputNome, inputCep, inputLogradouro, inputComplemento,
                      inputNumero, inputBairro, inputCidade, inputUf, inputIbge )
    }
  }
    
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertListPessoa = (id,cpf,nome,cep,logradouro,complemento,numero,bairro,cidade,uf,ibge ) => {
    var item = [id,cpf,nome,cep,logradouro,complemento,numero,bairro,cidade,uf,ibge]
    var table = document.getElementById('myTable');
 
    var row = table.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    insertButtonPessoa(row.insertCell(-1))
    insertButUpdatePessoa(row.insertCell(-1))

    document.getElementById("inputCpf").value = "";
    document.getElementById("inputNome").value = "";
    document.getElementById("inputCep").value = "";
    document.getElementById("inputLogradouro").value = "";
    document.getElementById("inputComplemento").value = "";
    document.getElementById("inputNumero").value = "";
    document.getElementById("inputBairro").value = "";
    document.getElementById("inputCidade").value = "";
    document.getElementById("inputUf").value = "";
    document.getElementById("inputIbge").value = "";
    
    removeElementPessoa()
    updateElementPessoa()

  }

  function mascaraCpf(i){
   
    var v = i.value;
    
    if(isNaN(v[v.length-1])){ // impede entrar outro caractere que não seja número
       i.value = v.substring(0, v.length-1);
       return;
    }
    
    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";
 
  }
 
  function VerificaCpf(valor) {
    var cpf = valor.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}
 
function validarCPF(cpf){
  if( !VerificaCpf(cpf.value) ){
    alert("CPF inválido!");
    cpf.value = "";
  }
}

function mascaraCep(i){
   
  var v = i.value;
    
  if(isNaN(v[v.length-1])){ // impede entrar outro caractere que não seja número
    i.value = v.substring(0, v.length-1);
    return;
  }
    
  i.setAttribute("maxlength", "10");
  if (v.length == 2 ) i.value += ".";
  if (v.length == 6) i.value += "-";
 
} 

function limpa_formulário_cep() {
  //Limpa valores do formulário de cep.
  document.getElementById('inputLogradouro').value=("");
  document.getElementById('inputComplemento').value=("");
  document.getElementById('inputNumero').value=("");
  document.getElementById('inputBairro').value=("");
  document.getElementById('inputCidade').value=("");
  document.getElementById('inputUf').value=("");
  document.getElementById('inputIbge').value=("");
}

function preencheCampos(conteudo) {
  
  if (!("erro" in conteudo)) {
      
      //Atualiza os campos com os valores.
      document.getElementById('inputLogradouro').value=(conteudo.logradouro.toUpperCase());
      document.getElementById('inputBairro').value=(conteudo.bairro.toUpperCase());
      document.getElementById('inputCidade').value=(conteudo.localidade.toUpperCase());
      document.getElementById('inputUf').value=(conteudo.uf.toUpperCase());
      document.getElementById('inputIbge').value=(conteudo.ibge.toUpperCase());
      
      // Atualizando o Form Modal.
      sLogradouro.value  = conteudo.logradouro.toUpperCase()
      sBairro.value      = conteudo.bairro.toUpperCase()
      sCidade.value      = conteudo.localidade.toUpperCase()
      sUf.value          = conteudo.uf.toUpperCase()
      sIbge.value        = conteudo.ibge.toUpperCase()   
      
  }
  else {
      limpa_formulário_cep();
      alert("CEP não encontrado.");
  }
}

function BuscaCep(valor){

    //Nova variável "cep" somente com dígitos.
     var cep = valor.replace(/\D/g, '');

     //Verifica se campo cep possui valor informado.
     if (cep != "") {

         //Expressão regular para validar o CEP.
         var validacep = /^[0-9]{8}$/;

         //Valida o formato do CEP.
         if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
             document.getElementById('inputLogradouro').value="";
             document.getElementById('inputComplemento').value="";
             document.getElementById('inputNumero').value="";
             document.getElementById('inputBairro').value="";
             document.getElementById('inputCidade').value="";
             document.getElementById('inputUf').value="";
             document.getElementById('inputIbge').value="";
                     
             //Cria um elemento javascript.
             var script = document.createElement('script');

             //Sincroniza com o callback.
             script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=preencheCampos';
             //Insere script no documento e carrega o conteúdo.
             document.body.appendChild(script);

         } 
         else {
             //cep é inválido.
             limpa_formulário_cep();
             alert("Formato de CEP inválido.");
         }
     } 
     else {
         //cep sem valor, limpa formulário.
         limpa_formulário_cep();
     }
  }

  function BuscaPorId(item){
    if( item == ''){
      alert( 'Favor informar um Id')
      return;
    }
    getPessoaPorId(item)
  }  

  function limpaTabela(){
    var tb = document.getElementById('myTable');
    while(tb.rows.length > 1) {
      tb.deleteRow(1);
    }    
  }
