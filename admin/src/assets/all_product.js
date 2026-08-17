import wire_1 from './wire/wire_1.png';
import wire_2 from './wire/wire_2.png';
import wire_3 from './wire/wire_3.png';
import wire_4 from './wire/wire_4.png';
import wire_5 from './wire/wire_5.png';
import wire_6 from './wire/wire_6.png';
import wire_7 from './wire/wire_7.png';
import wire_8 from './wire/wire_8.png';
import wire_9 from './wire/wire_9.png';
import wire_10 from './wire/wire_10.png';
import wire_11 from './wire/wire_11.png';
import wire_12 from './wire/wire_12.png';

import switch_1 from './switch/switch_1.png';
import switch_2 from './switch/switch_2.png';
import switch_3 from './switch/switch_3.png';
import switch_4 from './switch/switch_4.png';
import switch_5 from './switch/switch_5.png';
import switch_6 from './switch/switch_6.png';
import switch_7 from './switch/switch_7.png';
import switch_8 from './switch/switch_8.png';
import switch_9 from './switch/switch_9.png';
import switch_10 from './switch/switch_10.png';
import switch_11 from './switch/switch_11.png';
import switch_12 from './switch/switch_12.png';

import cb_1 from './cb/cb_1.png';
import cb_2 from './cb/cb_2.png';
import cb_3 from './cb/cb_3.png';
import cb_4 from './cb/cb_4.png';
import cb_5 from './cb/cb_5.png';
import cb_6 from './cb/cb_6.png';
import cb_7 from './cb/cb_7.png';
import cb_8 from './cb/cb_8.png';
import cb_9 from './cb/cb_9.png';
import cb_10 from './cb/cb_10.png';
import cb_11 from './cb/cb_11.png';
import cb_12 from './cb/cb_12.png';


const all_product = [

    // WIRES (1–12)

    {
        id:1,
        name:"Copper House Wire",
        category:"wire",
        image:wire_1,
        new_price:450,
        old_price:550,
    },

    {
        id:2,
        name:"Flexible Cable",
        category:"wire",
        image:wire_2,
        new_price:520,
        old_price:620,
    },

    {
        id:3,
        name:"Armoured Cable",
        category:"wire",
        image:wire_3,
        new_price:1200,
        old_price:1400,
    },

    {
        id:4,
        name:"Solar Cable",
        category:"wire",
        image:wire_4,
        new_price:700,
        old_price:850,
    },

    {
        id:5,
        name:"Multi Core Cable",
        category:"wire",
        image:wire_5,
        new_price:950,
        old_price:1100,
    },

    {
        id:6,
        name:"Aluminium Cable",
        category:"wire",
        image:wire_6,
        new_price:800,
        old_price:950,
    },

    {
        id:7,
        name:"PVC Cable",
        category:"wire",
        image:wire_7,
        new_price:400,
        old_price:500,
    },

    {
        id:8,
        name:"Industrial Cable",
        category:"wire",
        image:wire_8,
        new_price:1500,
        old_price:1800,
    },

    {
        id:9,
        name:"Fire Resistant Cable",
        category:"wire",
        image:wire_9,
        new_price:900,
        old_price:1050,
    },

    {
        id:10,
        name:"Coaxial Cable",
        category:"wire",
        image:wire_10,
        new_price:350,
        old_price:450,
    },

    {
        id:11,
        name:"Earthing Wire",
        category:"wire",
        image:wire_11,
        new_price:600,
        old_price:720,
    },

    {
        id:12,
        name:"Control Cable",
        category:"wire",
        image:wire_12,
        new_price:1100,
        old_price:1350,
    },


    // SWITCHES (13–24)

    {
        id:13,
        name:"Modular Switch",
        category:"switches",
        image:switch_1,
        new_price:120,
        old_price:150,
    },

    {
        id:14,
        name:"Smart Switch",
        category:"switches",
        image:switch_2,
        new_price:650,
        old_price:800,
    },

    {
        id:15,
        name:"Fan Regulator",
        category:"switches",
        image:switch_3,
        new_price:350,
        old_price:450,
    },

    {
        id:16,
        name:"Dimmer Switch",
        category:"switches",
        image:switch_4,
        new_price:420,
        old_price:500,
    },

    {
        id:17,
        name:"Socket",
        category:"switches",
        image:switch_5,
        new_price:180,
        old_price:220,
    },

    {
        id:18,
        name:"USB Socket",
        category:"switches",
        image:switch_6,
        new_price:480,
        old_price:550,
    },

    {
        id:19,
        name:"Touch Switch",
        category:"switches",
        image:switch_7,
        new_price:950,
        old_price:1150,
    },

    {
        id:20,
        name:"Waterproof Switch",
        category:"switches",
        image:switch_8,
        new_price:550,
        old_price:650,
    },

    {
        id:21,
        name:"DP Switch",
        category:"switches",
        image:switch_9,
        new_price:250,
        old_price:320,
    },

    {
        id:22,
        name:"Bell Switch",
        category:"switches",
        image:switch_10,
        new_price:140,
        old_price:180,
    },

    {
        id:23,
        name:"Extension Board",
        category:"switches",
        image:switch_11,
        new_price:650,
        old_price:780,
    },

    {
        id:24,
        name:"Industrial Switch",
        category:"switches",
        image:switch_12,
        new_price:980,
        old_price:1200,
    },


    // CIRCUIT BREAKERS (25–36)

    {
        id:25,
        name:"MCB",
        category:"circuitbreaker",
        image:cb_1,
        new_price:350,
        old_price:420,
    },

    {
        id:26,
        name:"MCCB",
        category:"circuitbreaker",
        image:cb_2,
        new_price:2500,
        old_price:2900,
    },

    {
        id:27,
        name:"RCCB",
        category:"circuitbreaker",
        image:cb_3,
        new_price:1450,
        old_price:1650,
    },

    {
        id:28,
        name:"ELCB",
        category:"circuitbreaker",
        image:cb_4,
        new_price:1200,
        old_price:1450,
    },

    {
        id:29,
        name:"Isolator",
        category:"circuitbreaker",
        image:cb_5,
        new_price:800,
        old_price:950,
    },

    {
        id:30,
        name:"Fuse Unit",
        category:"circuitbreaker",
        image:cb_6,
        new_price:650,
        old_price:780,
    },

    {
        id:31,
        name:"Distribution Box",
        category:"circuitbreaker",
        image:cb_7,
        new_price:1800,
        old_price:2200,
    },

    {
        id:32,
        name:"Contactor",
        category:"circuitbreaker",
        image:cb_8,
        new_price:2100,
        old_price:2500,
    },

    {
        id:33,
        name:"Relay",
        category:"circuitbreaker",
        image:cb_9,
        new_price:450,
        old_price:550,
    },

    {
        id:34,
        name:"Motor Starter",
        category:"circuitbreaker",
        image:cb_10,
        new_price:2900,
        old_price:3400,
    },

    {
        id:35,
        name:"Changeover Switch",
        category:"circuitbreaker",
        image:cb_11,
        new_price:1350,
        old_price:1600,
    },

    {
        id:36,
        name:"Surge Protector",
        category:"circuitbreaker",
        image:cb_12,
        new_price:950,
        old_price:1150,
    }

];

export default all_product;