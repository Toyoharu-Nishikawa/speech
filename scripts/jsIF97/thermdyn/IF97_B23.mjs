/*******************************************************************/
/*  Pb23T(T,P)                                                     */
/*  Tb23P(P,T)                                                     */
/*******************************************************************/

/*************************************/
/*       Sub Routine                 */
/*************************************/
/* boundary between regions 2 and 3*/
/* based on Eqs.(5) and (6) of IAPWS-IF97*/
"use strict"

  const N1  =  0.34805185628969e+3;
  const N2  = -0.11671859879975e+1;
  const N3  =  0.10192970039326e-2;

  const N4  =  0.57254459862746e+3;
  const N5  =  0.13918839778870e+2;  

export const  Pb23T = (T) => {
  
  const P= (N3 * T + N2) * T + N1

  return P 
}

export const Tb23P = (P) => {
  
  const D = (P - N5) / N3
  if(D<0.0){
    throw new RangeError("function Tb23P D<0 in IF97_B23.mjs")
  }
  const  T = N4 + Math.sqrt(D)  
  
  return T 
}

    
