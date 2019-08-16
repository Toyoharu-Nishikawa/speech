/*******************************************************************/
/*  trasatT.for                                                    */
/*(given T calculates mu, nu, lambda, and Pr for saturated liquid 
/* and satureted vapor) 
/*******************************************************************/



import {region_1} from "../thermdyn/IF97_1.mjs"
import {region_2} from "../thermdyn/IF97_2.mjs"
import {region_3} from "../thermdyn/IF97_3.mjs"
import {PsatT} from '../thermdyn/IF97_Sat.mjs'
import {Vsatl_3, Vsatg_3} from "../thermdyn/Aux_3.mjs"
import {viscos, conduc} from "./transp.mjs"

"use strict"

export transatT = (T) => {
  
  if(T<273.15){
    throw new RangeError("function transatT Temperature is lower than the minimum temperature in transatT.mjs");
  }
  if(T>647.096){
    throw new RangeError("function transatT Temperature is lower than the maximum temperature in transatT.mjs");
  }
  
  let statel
  let stateg
  const P = PsatT(T)
  if(T<=623.15){
    statel = region_1(P, T)
    stateg = region_2(P, T)
  }
  else{
    const vl = Vsatl_3(T)
    const vg = Vsatg_3(T)
    statel = region_3(vl, T)
    stateg = region_3(vg, T)
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
