import fetch from 'node-fetch';
import { sleep } from './helpers/sleep';

export const  _getQuitada: any =  async (dados: any) => {
        const {chave, quitBody, token} = dados
        const headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E269 Safari/602.1',
            'Cookie': `rxvt=${chave}`,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
        const url = 'https://servicosonline.cpfl.com.br/agencia-webapi/api/historico-contas/contas-quitadas'
        const response = await fetch(url, {method: 'POST', body: JSON.stringify(quitBody), headers: headers});
        if(response.status != 200){
            console.log(`Retry getQuitada [${response.status}]`)
            return {status: response.status}
        }else{
            const retorno = await response.json();
            return  {status: 200, "partBody": { NumeroDocumento: retorno['ContasPagas'][0]['NumeroContaEnergia']}} 
        }
    }

    export const getQuitada: any =  async (dados: any) => {
        let times = 2
        while(times > 0){
            const result = await _getQuitada(dados)
            if(result.status !== 200){
                await sleep(1);
                times--;
            }else{
                times = 0;
                return result
            }
        }
        return {status: 1, body: dados.partBody }
    }