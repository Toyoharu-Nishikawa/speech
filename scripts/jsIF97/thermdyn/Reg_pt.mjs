/*******************************************************************/
/* RegPT(P, T, M, NP)
/*  (given P and T find the region)
/*******************************************************************/

import {TsatP,PsatT} from "./IF97_Sat.mjs"
import {Tb23P} from "./IF97_B23.mjs"

//     M=1: region 1
//       2: region 2
//       3: region 3
//       5: region 5
//       0: out of IF97

const T1 = 623.15
const P1 = PsatT(T1)


export const RegPT = (P, T, NP) => {
  /* input P: MPa, H: kJ/kg */
  /* output M               */
  
  /* Test of maximum pressure */
  if(P > 100){
    const M = 0
    return M 
  }
  /* Test below 10 MPa */  
  if(P <= 10){
    if(T>2273.15){
      const M = 0
      return M
    }
    if(T>1073.15){
      const M = 5
      return M 
    }
    const Ttest = TsatP(P)

    if(NP !=1){
      if(T>=Ttest){
        const M = 2
        return M 
      }
    }
    else{
      if(T>Ttest){
        const M = 2
        return M 
      }
    }
    if(T>=273.15){
      const M = 1
      return M 
    }
    else{
      const M = 0
      return M 
    }
  }
  /*Test below saturation pressure at 350 degC*/
  if(P<=P1){
    if(T>1073.15){
      const M=0
      return M 
    }
    const Ttest = TsatP(P)
    if(NP != 1){
      if(T>=Ttest){
        const M = 2
        return M  
      }
    }
    else{
      if(T>Ttest){
        const M = 2
        return M          
      }
    }
    if(T>=273.15){
      const M = 1
      return M           
    }
    else{
      const M = 0
      return M                
    }
  }

  /*Test above saturation pressure at 350 degC*/
  if(T > 1073.15){
    const M = 0
    return M  
  }
  const Ttest = Tb23P(P)
  if(T >= Ttest){
    const M = 2
    return M      
  }
  if(T>623.15){
    const M=3
    return M      
  }  
  if(T>=273.15){
    const M = 1
    return M      
  }
  else{
    const M = 0
    return M 
  }  
}
