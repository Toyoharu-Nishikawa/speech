import {region_1} from './IF97_1.mjs'
import {region_2} from './IF97_2.mjs'
import {region_3} from './IF97_3.mjs'
import {region_5} from './IF97_5.mjs'
import {PsatT,TsatP} from './IF97_Sat.mjs'
import {ZPH_1,ZPS_1} from './Aux_1.mjs'
import {ZPH_2,ZPS_2} from './Aux_2.mjs'
import {ZHS_2} from './Aux_2HS.mjs'
import {VPT_30} from './Aux_3.mjs'
import {ZPH_5,ZPS_5} from './Aux_5.mjs'
import {RegPT} from './Reg_pt.mjs'
import {RegPH} from './Reg_ph.mjs'
import {RegPS} from './Reg_ps.mjs'
import {expisen1,expisen2} from './expisen.mjs'
import {satproP} from './satproP.mjs'
import {satproT} from './satproT.mjs'
import {propPT} from './propPT.mjs'
import {propPH} from './propPH.mjs'
import {propPS} from './propPS.mjs'
import {propHS} from './propHS.mjs'
import {viscos, conduc} from './transp.mjs'
import {transPT} from './transPT.mjs'
import {transatT} from './transatT.mjs'
import {transatP} from './transatP.mjs'

var T = 500;
var P =16;
var SPl = {}
var SPg = {}
var SP= {
  P: 10,  
  T: 300, 
};

trasatP(P, SPl, SPg);
console.log(SPl, SPg);

