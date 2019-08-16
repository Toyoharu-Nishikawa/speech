/*******************************************************************/
/* transPT.for                                                    */
/*  (given P and T calculate mu, nu, lambda, and Pr for all regions of
     IAPWS-IF97 except region 5) 
/*******************************************************************/

import {region_1} from "../thermdyn/IF97_1.mjs"
import {region_2} from "../thermdyn/IF97_2.mjs"
import {region_3} from "../thermdyn/IF97_3.mjs"
import {VPT_3} from "../thermdyn/Aux_3.mjs"
import {RegPT} from "../thermdyn/Reg_pt.mjs"
import {viscos, conduc} from "./transp.mjs"


"use strict"

export const transPT = (P, T) => {
  const NP = 2
  const M = RegPT(P, T, NP)
  let state
  switch(M){
    case 1 :{
      state = region_1(P, T)
      break
    }
    case 2 : {
      state = region_2(P, T)
      break
    }
    case 3 : {
      const v = VPT_3(P, T)
      state = region_3(v, T)
      break
    }
    case 5 : {
      throw new RangeError("function transPT Region_5 is not applicable. in transPT.mjs")
    }
    default : {
      throw new RangeError("function transPT M  in transPT.mjs")
    }
  }
  const v = state.v
  const cp = state.cp
  const mu = viscos(v, T)
  const lambda = conduc(v, T)

  const nu = mu * v
  const Pr = cp * mu / lambda * 1.0e+3
  
  const trans = {
    mu: mu,
    lambda: lambda,
    nu: nu,
    Pr: Pr,
  } 

  return trans
}
