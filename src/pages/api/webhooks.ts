import { NextApiRequest, NextApiResponse } from "next";


// webhooks é um desing parttner usado na web
//é quando estamos usando uma app terceiro, neste caso o stripe, acontece um erro 
// e o stripe avisa do erro, por exemplo erro no pagamento
// uma forma d efazer isso é disponibilizar uma rota hhtp para recebimento de erros
// key 123456
export default (
  req: NextApiRequest,
  res: NextApiResponse
)=> {
  console.log("evento recebido")
  return res.status(200).json({ok: true});
}