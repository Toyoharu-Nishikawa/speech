/*******************************************************************/
/*expisPT.for
/*  (given P and T calculate isentropic exponent, Cp, and Cv in the
/*   regions 1, 2, 3, and 5)
/*******************************************************************/

import {RegPT} from "./Reg_pt.mjs"
import {expisen1, expisen2, expisen3, expisen5} from "./expisen.mjs"
 
export const expisPT = (P, T) => {
  if(P <= 0){
    throw new RangeError("function expisPT P<=0 in expisPT.mjs")
  }
  const NP=2
  const M = RegPT(P, T, NP)
  switch(M){
    case 1 :{
      const expis = expisen1(P, T)
      return expis
    }
    case 2: {
      const expis = expisen2(P, T)
      return expis
    }
    case 3: {
      const expis = expisen3(P, T)
      return expis
    }
    case 5: {
      const expis = expisen5(P, T)
      return expis
    }
    default:{
      throw new RangeError("function expisPT M in expisPT.mjs")
    }
  }
}
