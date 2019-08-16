/*******************************************************************/
/*  trasatP.for
/*(given P calculates mu, nu, lambda, and Pr for saturated liquid 
/* and satureted vapor)
/*******************************************************************/

import {region_1} from "../thermdyn/IF97_1.mjs"
import {region_2} from "../thermdyn/IF97_2.mjs"
import {region_3} from "../thermdyn/IF97_3.mjs"
import {PsatT, TsatP} from '../thermdyn/IF97_Sat.mjs'
import {Vsatl_3, Vsatg_3} from "../thermdyn/Aux_3.mjs"
import {viscos, conduc} from "./transp.mjs"

"use strict"

export const transatP = (P) => {
  
  if(P <= 0.0){
    throw new RangeError("function transatP P<=0 in transatP.mjs");
  }
  const Ttmp1 = 273.15
  const Ptmp1 = PsatT(Ttmp1)
  if(P < Ptmp1){
    throw new RangeError("function transatP P<=min in transatP.mjs");
  }
  if(P > 22.064){
    throw new RangeError("function transatP P>22.064 in transatP.mjs");
  }
  
  const Ttmp2 = TsatP(P)

  let statel
  let stateg

  if(Ttmp2 <= 623.15){
    statel = region_1(P, Ttmp2)
    stateg = region_2(P, Ttmp2)
  }
  else{
    const vl = Vsatl_3(Ttmp2)
    const vg = Vsatg_3(Ttmp2)
    statetl = region_3(vl, Ttmp2)
    statetg = region_3(vg, Ttmp2)
  } 
  const vl = statel.v
  const vg = statel.g

  const cpl = statel.cp
  const cpg = stateg.cp

  const mul = viscos(vl, Ttmp2)
  const mug = viscos(vg, Ttmp2)

  const lambdal = conduc(vl, Ttmp2)
  const lambdag = conduc(vg, Ttmp2)

  const nul = mul * vl
  const nug = mug * vg

  const Prl = cpl * mul /lambdal *1.0e+3
  const Prg = cpg * mug /lambdag *1.0e+3

  const trans = {
    l: {
      mu: mul,
      lambda: lambdal,
      nu: nul, 
      Pr: Prl,
    },
    g: {
      mu: mug,
      lambda: lambdag,
      nu: nug, 
      Pr: Prg,
    }
  }
  
  return trans 
}
