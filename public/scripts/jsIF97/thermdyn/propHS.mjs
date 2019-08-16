/*******************************************************************/
/*  propHS.for
/*  (given P and S calculate properties of the regions 1, 2, 3, 5,
/*   and wet steam region) 
/*******************************************************************/

import {ZHS_2} from "./Aux_2HS.mjs"

"use strict"

export const  propHS = (h, s) => {
  if(h <= 0){
    throw new RangeError("function propHS enthalpy is lower than zero in propHS.mjs");
  }
  const state = ZHS_2(h, s)

  const Nin = state.Nin 
  //check validity
  switch(Nin){
    case 1 : {
      throw new RangeError("function propPH S is too hightin propPH.mjs.");
    }
    case 2 : {
      throw new RangeError("function propPH S is too low in propPH.mjs.");
    }
    case 3 :{
      throw new RangeError("function propPH H is too hgiht in propPH.mjs.");
    }
    case 4 : {
      throw new RangeError("function propPH H is too low in propPH.mjs.");
    }
    default: {
      //check validity
      //if(SP.nx==0){
        //console.log("Wet region");
      //}
      //else{
        //console.log("Dry region");    
      //}
      return state
    }
  }
}

    
