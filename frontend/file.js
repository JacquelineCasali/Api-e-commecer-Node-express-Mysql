

const input=document.querySelector('#arquivos')
const preview=document.querySelector('#preview')
const botao=document.querySelector('#baixar')

//ler o arquivo
input.addEventListener('change',function(){
    const arquivo=this.files[0];
    const leitor=new FileReader();
    
    //contudo lido 
    leitor.addEventListener('load',function(){
        preview.value=leitor.result
    })
    //ver se o arquivo existe
    if(arquivo){
        leitor.readAsText(arquivo)
    }
})

//doawload
const dowload=function(){
    const a= document.createElement('a')
    a.style='display:none'
    document.body.appendChild(a);
    return function(conteudo, nomedoArquivo){
        const bolb=new Blob([conteudo],
            {type:'octet/stream'}
            
            
            )

            const url=window.URL.createObjectURL(bolb)
   a.href=url
   a.download=nomedoArquivo
   a.click()
   window.URL.revokeObjectURL(url)
   
        }       
}
botao.addEventListener('click',function(){
   dowload()(preview.value,'jogos.txt') 
})