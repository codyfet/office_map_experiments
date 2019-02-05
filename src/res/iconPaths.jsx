import React from "react";

const iconPaths = {
  delete: {
   path: [
     "M174.239,31.452h-16.42h-41.773V0.319H58.204v31.133H16.42H0v16.335h16.42V173.92h141.399V47.787h16.42V31.452z    M74.539,16.654h25.172v14.798H74.539V16.654z M141.484,157.585H32.755V47.787h25.449h57.842h25.438V157.585z"
   ],
   viewBox: "0 0 174.239 174.239"
  },
  edit: {
    path: [
      "M124.891,57.896c2.269,1.589,2.823,4.743,1.232,7.01l-64.835,92.396c-1.591,2.267-5.05,4.813-7.688,5.657l-30.499,9.763 c-2.638,0.844-4.885-0.729-4.993-3.496l-1.257-31.999c-0.109-2.767,1.104-6.886,2.695-9.153L84.38,35.677 c1.591-2.267,4.748-2.822,7.017-1.234L124.891,57.896z",
      "M148.248,24.358c2.269,1.589,2.825,4.744,1.237,7.013l-9.239,13.194c-1.589,2.269-4.744,2.825-7.013,1.237L99.739,22.349 c-2.269-1.589-2.825-4.744-1.237-7.013l9.239-13.194c1.589-2.269,4.744-2.825,7.013-1.237L148.248,24.358z",
      "M157.395,168.947c0,2.77-2.266,5.044-5.035,5.054l-64.924,0.238c-2.769,0.01-3.733-1.835-2.14-4.101l17.637-25.098 c1.592-2.266,5.161-4.132,7.93-4.147l41.497-0.221c2.769-0.015,5.035,2.239,5.035,5.009V168.947z",
      "M157.395,124.769c0,2.769-2.266,5.049-5.035,5.065l-36.261,0.215c-2.769,0.016-3.733-1.824-2.14-4.09l17.637-25.098 c1.592-2.266,5.161-4.147,7.93-4.18l12.835-0.154c2.769-0.033,5.035,2.205,5.035,4.975V124.769z"
    ],
    viewBox: "0 0 174.239 174.239"
  },
  ready: { 
    path: [
      "M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305 c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z",
      "M131.55,59.413c-3.231-2.562-7.927-2.027-10.491,1.211L86.694,103.95L66.132,82.015c-2.812-3.014-7.543-3.155-10.555-0.345 c-3.009,2.825-3.162,7.55-0.34,10.555l26.481,28.251c1.415,1.512,3.389,2.363,5.447,2.363c0.102,0,0.204,0,0.309-0.005 c2.168-0.092,4.193-1.123,5.542-2.825L132.76,69.9C135.322,66.672,134.78,61.976,131.55,59.413z"
    ],
    viewBox: "0 0 174.239 174.239"
  },
  turn: {
    path: [
      "M96.033,79.444c0-1.497,0-5.173,0-8.168v-5.538c0-2.995,2.049-4.102,4.554-2.46l34.298,27.462 c2.505,1.642,2.507,4.332,0.005,5.978l-34.309,27.557c-2.502,1.646-4.548,0.543-4.548-2.452v-5.66c0-2.995,0-6.67,0-8.167 c0-1.497-2.436-2.461-5.414-2.142c0,0-49.807,5.33-49.807,68.384h127.983c2.995,0,5.445-2.45,5.445-5.445V5.445 c0-2.995-2.45-5.445-5.445-5.445H5.445C2.45,0,0,2.45,0,5.445v111.209c0,2.995,0,7.895,0,10.89v5.443 c21.188-52.6,90.59-50.949,90.59-50.949C93.584,82.108,96.033,80.942,96.033,79.444z"
    ],
    viewBox: "0 0 174.239 174.239"
  },
  user: {
    path: [
      "M18.613,41.552l-7.907,4.313c-0.464,0.253-0.881,0.564-1.269,0.903C14.047,50.655,19.998,53,26.5,53  c6.454,0,12.367-2.31,16.964-6.144c-0.424-0.358-0.884-0.68-1.394-0.934l-8.467-4.233c-1.094-0.547-1.785-1.665-1.785-2.888v-3.322  c0.238-0.271,0.51-0.619,0.801-1.03c1.154-1.63,2.027-3.423,2.632-5.304c1.086-0.335,1.886-1.338,1.886-2.53v-3.546  c0-0.78-0.347-1.477-0.886-1.965v-5.126c0,0,1.053-7.977-9.75-7.977s-9.75,7.977-9.75,7.977v5.126  c-0.54,0.488-0.886,1.185-0.886,1.965v3.546c0,0.934,0.491,1.756,1.226,2.231c0.886,3.857,3.206,6.633,3.206,6.633v3.24  C20.296,39.899,19.65,40.986,18.613,41.552z",
      "M26.953,0.004C12.32-0.246,0.254,11.414,0.004,26.047C-0.138,34.344,3.56,41.801,9.448,46.76   c0.385-0.336,0.798-0.644,1.257-0.894l7.907-4.313c1.037-0.566,1.683-1.653,1.683-2.835v-3.24c0,0-2.321-2.776-3.206-6.633   c-0.734-0.475-1.226-1.296-1.226-2.231v-3.546c0-0.78,0.347-1.477,0.886-1.965v-5.126c0,0-1.053-7.977,9.75-7.977   s9.75,7.977,9.75,7.977v5.126c0.54,0.488,0.886,1.185,0.886,1.965v3.546c0,1.192-0.8,2.195-1.886,2.53   c-0.605,1.881-1.478,3.674-2.632,5.304c-0.291,0.411-0.563,0.759-0.801,1.03V38.8c0,1.223,0.691,2.342,1.785,2.888l8.467,4.233   c0.508,0.254,0.967,0.575,1.39,0.932c5.71-4.762,9.399-11.882,9.536-19.9C53.246,12.32,41.587,0.254,26.953,0.004z"
    ],
    viewBox: "0 0 53 53"
  },
  // objects:
  table: {
    path: [
      "m480 55.847656c-.023438-.925781-.207031-1.839844-.542969-2.703125-.097656-.222656-.203125-.445312-.320312-.65625-.132813-.316406-.28125-.628906-.449219-.929687l-32-48c-1.488281-2.234375-4-3.5703128-6.6875-3.558594h-400c-2.675781 0-5.171875 1.335938-6.65625 3.558594l-32 48c-.167969.300781-.316406.613281-.449219.929687-.117187.210938-.222656.433594-.320312.65625-.347657.859375-.542969 1.773438-.574219 2.703125v.152344 48c0 4.417969 3.582031 8 8 8h8v216c0 4.417969 3.582031 8 8 8h48c4.417969 0 8-3.582031 8-8v-184h320v184c0 4.417969 3.582031 8 8 8h48c4.417969 0 8-3.582031 8-8v-216h8c4.417969 0 8-3.582031 8-8v-48c0-.054688 0-.097656 0-.152344zm-435.71875-39.847656h391.4375l21.335938 32h-434.109376zm403.71875 304h-32v-184c0-4.417969-3.582031-8-8-8h-336c-4.417969 0-8 3.582031-8 8v184h-32v-208h416zm16-224h-448v-32h448zm0 0"
    ],
    viewBox: "0 -72 480 480"
  },
  cupboard: {
    path: [
      "M364.48,0H126.507c-27.627,0-51.84,24.32-51.84,51.947v356.16c0,24.32,18.773,45.227,42.667,49.6V480     c0,5.867,4.8,10.667,10.667,10.667c5.867,0,10.667-4.8,10.667-10.667v-21.333H352V480c0,5.867,4.8,10.667,10.667,10.667     c5.867,0,10.667-4.8,10.667-10.667v-22.293c23.893-4.267,42.667-25.173,42.667-49.6V51.947C416,24.32,391.893,0,364.48,0z      M234.667,437.333h-108.16c-16,0-30.507-13.867-30.507-29.227V51.947c0-15.68,14.827-30.613,30.507-30.613h108.16V437.333z      M394.667,408.107c0,15.573-14.08,29.227-30.187,29.227H256v-416h108.48c15.573,0,30.187,14.933,30.187,30.613V408.107z",
      "M202.667,256c5.867,0,10.667-4.8,10.667-10.667v-64c0-5.867-4.8-10.667-10.667-10.667c-5.867,0-10.667,4.8-10.667,10.667     v64C192,251.2,196.8,256,202.667,256z",
      "M288,170.667c-5.867,0-10.667,4.8-10.667,10.667v64c0,5.867,4.8,10.667,10.667,10.667c5.867,0,10.667-4.8,10.667-10.667     v-64C298.667,175.467,293.867,170.667,288,170.667z"
    ],
    viewBox: "0 0 490.667 490.667"
  },
  printer: {
    path: [
      "m8 336h56v24c0 4.417969 3.582031 8 8 8h240c4.417969 0 8-3.582031 8-8v-24h56c4.417969 0 8-3.582031 8-8v-152c0-17.671875-14.328125-32-32-32h-40v-56c0-4.417969-3.582031-8-8-8h-24v-72c0-4.417969-3.582031-8-8-8h-160c-4.417969 0-8 3.582031-8 8v72h-24c-4.417969 0-8 3.582031-8 8v56h-40c-17.671875 0-32 14.328125-32 32v152c0 4.417969 3.582031 8 8 8zm288-72v24h-24v-48c13.253906 0 24 10.746094 24 24zm-168 8h128v16h-128zm128-16h-128v-16h128zm-144 8v24h-24v-24c0-13.253906 10.746094-24 24-24zm-25.753906 40h211.507812l4 16h-219.507812zm217.753906 48h-224v-16h224zm-8-256v48h-16v-48zm-176-80h144v128h-144zm-32 80h16v48h-16zm-72 80c0-8.835938 7.164062-16 16-16h320c8.835938 0 16 7.164062 16 16v144h-49.761719l-6.238281-24.976562v-31.023438c-.027344-22.082031-17.917969-39.972656-40-40h-160c-22.082031.027344-39.972656 17.917969-40 40v31.023438l-6.238281 24.976562h-49.761719zm0 0",
      "m144 48h96v16h-96zm0 0",
      "m144 80h96v16h-96zm0 0",
      "m144 112h96v16h-96zm0 0",
      "m304 192h16v16h-16zm0 0",
      "m336 192h16v16h-16zm0 0"
    ],
    viewBox: "0 -8 384 384"
  },
  scaner: {
    path: [
      "m443.214844 0h-374.429688l-30 30h-38.785156v180h30v272h-30v30h512v-30h-30v-272h30v-180h-38.785156zm-383.214844 482v-30h392v30zm392-60h-392v-212h30v150h332v-150h30zm-60-272v180h-272v-180zm90 30h-60v-30h30v-30h-392v30h30v30h-60v-120h21.214844l30-30h349.570312l30 30h21.214844zm0 0",
      "m150 270h212v30h-212zm0 0",
      "m150 210h212v30h-212zm0 0",
      "m90 60h30v30h-30zm0 0",
      "m150 60h30v30h-30zm0 0",
      "m332 60h90v30h-90zm0 0"
    ],
    viewBox: "0 0 512 512"
  },
  shredder: {
    path: [
      "m337.21875 62.605469h-163.714844c-8.285156 0-15 6.714843-15 15 0 8.285156 6.714844 15 15 15h163.714844c8.285156 0 15-6.714844 15-15 0-8.285157-6.714844-15-15-15zm0 0", 
      "m337.21875 124.019531h-170.511719c-8.285156 0-15 6.71875-15 15 0 8.285157 6.714844 15 15 15h170.511719c8.285156 0 15-6.714843 15-15 0-8.28125-6.714844-15-15-15zm0 0",
      "m481.851562 212.910156h-62.292968v-197.410156c0-8.285156-6.714844-15-15-15h-305.191406c-8.28125 0-15 6.714844-15 15v197.410156h-54.222657c-16.648437 0-30.144531 13.496094-30.144531 30.144532v95.292968c0 16.648438 13.496094 30.148438 30.144531 30.148438h65.585938v19.707031c0 24.5625-14.984375 45.695313-35.691407 50.414063-7.980468 1.820312-13.445312 9.5-11.910156 17.542968 1.382813 7.230469 7.691406 12.199219 14.722656 12.199219 1.054688 0 2.132813-.113281 3.207032-.347656 16.695312-3.636719 31.875-13.554688 42.734375-27.933594 11.082031-14.664063 16.9375-32.601563 16.9375-51.875v-19.707031h31.261719v37.226562c0 29.707032-10.898438 48.472656-32.386719 55.773438-7.84375 2.667968-12.042969 11.1875-9.375 19.03125 2.121093 6.246094 7.953125 10.175781 14.199219 10.175781 1.601562 0 3.230468-.257813 4.828124-.800781 34.003907-11.558594 52.730469-41.453125 52.730469-84.179688v-37.226562h22.152344v54.902344c0 22.636718-3.292969 39.464843-6.59375 49.917968-2.050781 6.503906.53125 13.566406 6.300781 17.203125 8.308594 5.234375 19.289063 1.191407 22.285156-8.164062 3.976563-12.429688 8.007813-31.742188 8.007813-58.960938v-54.898437h27.945313v54.902344c0 27.21875 4.035156 46.53125 8.011718 58.960937 2.996094 9.351563 13.972656 13.394531 22.285156 8.160156 5.769532-3.636719 8.351563-10.699219 6.300782-17.203125-3.300782-10.453125-6.597656-27.28125-6.597656-49.917968v-54.902344h22.152343v37.226562c0 42.726563 18.730469 72.621094 52.734375 84.179688 1.597656.542968 3.226563.800781 4.828125.800781 6.382813 0 12.335938-4.109375 14.335938-10.59375 2.414062-7.832031-2.203125-16.054687-9.9375-18.757813-21.207031-7.40625-31.960938-26.121093-31.960938-55.625v-37.230468h31.257813v19.707031c0 19.273437 5.859375 37.214844 16.941406 51.878906 10.859375 14.375 26.039062 24.292969 42.734375 27.929688 1.074219.234375 2.148437.347656 3.207031.347656 7.027344 0 13.34375-4.96875 14.722656-12.199219 1.53125-8.042968-3.929687-15.722656-11.914062-17.539062-20.703125-4.71875-35.691406-25.855469-35.691406-50.417969v-19.707031h71.355468c16.648438 0 30.144532-13.496094 30.144532-30.148438v-95.292968c.003906-16.648438-13.492188-30.144532-30.144532-30.144532zm-367.484374-182.410156h275.191406v182.410156h-275.191406zm367.632812 307.847656c0 .082032-.066406.148438-.144531.148438h-451.710938c-.078125 0-.144531-.066406-.144531-.148438v-95.292968c0-.082032.066406-.144532.144531-.144532h451.707031c.082032 0 .148438.0625.148438.144532zm0 0",
      "m98.191406 275.703125h-36.089844c-8.28125 0-15 6.714844-15 15s6.71875 15 15 15h36.089844c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15zm0 0",
      "m394.574219 290.703125c0-8.855469-7.128907-16.03125-15.921875-16.03125-8.792969 0-15.921875 7.175781-15.921875 16.03125 0 8.851563 7.128906 16.03125 15.921875 16.03125 8.792968 0 15.921875-7.179687 15.921875-16.03125zm0 0",
      "m456.140625 290.703125c0-8.855469-7.128906-16.03125-15.921875-16.03125-8.796875 0-15.921875 7.175781-15.921875 16.03125 0 8.851563 7.125 16.03125 15.921875 16.03125 8.792969 0 15.921875-7.179687 15.921875-16.03125zm0 0",
    ],
    viewBox: "0 -9 511.997 511"
  },
  column: {
    path: [
      "M8.693,93.85h58.912V17.115H8.693V93.85z M13.47,21.893h49.358v67.182H13.47V21.893z"
    ],
    viewBox: "0 0 60 60"
  },
  meeting_room: {
    path: [
      "m463.800781 362.601562v-5.796874c0-34.847657-28.351562-63.199219-63.199219-63.199219-19.300781 0-36.597656 8.707031-48.199218 22.386719-11.601563-13.679688-28.898438-22.386719-48.203125-22.386719-19.300781 0-36.597657 8.707031-48.199219 22.386719-11.601562-13.679688-28.898438-22.386719-48.199219-22.386719s-36.597656 8.707031-48.199219 22.386719c-11.601562-13.679688-28.898437-22.386719-48.199218-22.386719-34.847656 0-63.199219 28.351562-63.199219 63.199219v5.796874c-27.632813 6.753907-48.203125 31.707032-48.203125 61.386719v88.011719h512v-88.011719c0-29.679687-20.570312-54.632812-48.199219-61.386719zm-63.199219-38.996093c18.304688 0 33.199219 14.894531 33.199219 33.199219v5.796874c-13.15625 3.21875-24.707031 10.558594-33.199219 20.574219-8.496093-10.015625-20.046874-17.359375-33.199218-20.574219v-5.796874c-.003906-18.304688 14.890625-33.199219 33.199218-33.199219zm-96.402343 0c18.308593 0 33.199219 14.894531 33.199219 33.199219v5.796874c-13.15625 3.21875-24.703126 10.558594-33.199219 20.574219-8.496094-10.015625-20.042969-17.359375-33.199219-20.574219v-5.796874c0-18.304688 14.894531-33.199219 33.199219-33.199219zm-96.398438 0c18.304688 0 33.199219 14.894531 33.199219 33.199219v5.796874c-13.15625 3.21875-24.703125 10.558594-33.199219 20.574219-8.496093-10.015625-20.042969-17.359375-33.199219-20.574219v-5.796874c0-18.304688 14.890626-33.199219 33.199219-33.199219zm-96.402343 0c18.308593 0 33.199218 14.894531 33.199218 33.199219v5.796874c-13.15625 3.21875-24.703125 10.558594-33.199218 20.574219-8.492188-10.015625-20.042969-17.359375-33.199219-20.574219v-5.796874c0-18.304688 14.894531-33.199219 33.199219-33.199219zm-15 158.394531h-66.398438v-58.011719c0-18.304687 14.894531-33.199219 33.199219-33.199219 18.308593 0 33.199219 14.894532 33.199219 33.199219zm96.402343 0h-66.402343v-58.011719c0-18.304687 14.894531-33.199219 33.199218-33.199219 18.308594 0 33.203125 14.894532 33.203125 33.199219zm96.398438 0h-66.398438v-58.011719c0-18.304687 14.894531-33.199219 33.199219-33.199219s33.199219 14.894532 33.199219 33.199219zm96.402343 0h-66.402343v-58.011719c0-18.304687 14.894531-33.199219 33.199219-33.199219 18.308593 0 33.199218 14.894532 33.199218 33.199219v58.011719zm96.398438 0h-66.398438v-58.011719c0-18.304687 14.890626-33.199219 33.199219-33.199219 18.304688 0 33.199219 14.894532 33.199219 33.199219zm0 0",
      "m0 0v261.773438h512v-261.773438zm482 231.773438h-452v-201.773438h452zm0 0",
      "m242.675781 100.523438v64.085937l48.589844-32.042969zm0 0",
      "m195.003906 183.757812c13.671875 16.292969 32.871094 26.285157 54.0625 28.140626 2.367188.207031 4.722656.308593 7.070313.308593 18.671875 0 36.582031-6.496093 51.054687-18.640625 16.292969-13.675781 26.285156-32.875 28.136719-54.0625 1.855469-21.191406-4.65625-41.832031-18.328125-58.125-13.675781-16.292968-32.875-26.289062-54.0625-28.140625-21.195312-1.855469-41.835938 4.65625-58.128906 18.332031-16.292969 13.671876-26.285156 32.871094-28.136719 54.0625-1.855469 21.1875 4.65625 41.832032 18.332031 58.125zm29.089844-89.207031c9.023438-7.574219 20.183594-11.621093 31.820312-11.621093 1.464844 0 2.933594.066406 4.40625.195312 13.207032 1.152344 25.175782 7.382812 33.695313 17.535156 8.523437 10.15625 12.582031 23.023438 11.425781 36.230469-1.152344 13.207031-7.382812 25.171875-17.535156 33.695313-10.15625 8.523437-23.027344 12.582031-36.230469 11.425781-13.207031-1.15625-25.171875-7.382813-33.695312-17.539063-17.589844-20.964844-14.847657-52.332031 6.113281-69.921875zm0 0"
    ],
    viewBox: "0 0 512 512"
  },
  public_place: {
    path: [
      "M48.355,17.922c3.705,2.323,6.303,6.254,6.776,10.817c1.511,0.706,3.188,1.112,4.966,1.112   c6.491,0,11.752-5.261,11.752-11.751c0-6.491-5.261-11.752-11.752-11.752C53.668,6.35,48.453,11.517,48.355,17.922z M40.656,41.984   c6.491,0,11.752-5.262,11.752-11.752s-5.262-11.751-11.752-11.751c-6.49,0-11.754,5.262-11.754,11.752S34.166,41.984,40.656,41.984   z M45.641,42.785h-9.972c-8.297,0-15.047,6.751-15.047,15.048v12.195l0.031,0.191l0.84,0.263   c7.918,2.474,14.797,3.299,20.459,3.299c11.059,0,17.469-3.153,17.864-3.354l0.785-0.397h0.084V57.833   C60.688,49.536,53.938,42.785,45.641,42.785z M65.084,30.653h-9.895c-0.107,3.959-1.797,7.524-4.47,10.088   c7.375,2.193,12.771,9.032,12.771,17.11v3.758c9.77-0.358,15.4-3.127,15.771-3.313l0.785-0.398h0.084V45.699   C80.13,37.403,73.38,30.653,65.084,30.653z M20.035,29.853c2.299,0,4.438-0.671,6.25-1.814c0.576-3.757,2.59-7.04,5.467-9.276   c0.012-0.22,0.033-0.438,0.033-0.66c0-6.491-5.262-11.752-11.75-11.752c-6.492,0-11.752,5.261-11.752,11.752   C8.283,24.591,13.543,29.853,20.035,29.853z M30.589,40.741c-2.66-2.551-4.344-6.097-4.467-10.032   c-0.367-0.027-0.73-0.056-1.104-0.056h-9.971C6.75,30.653,0,37.403,0,45.699v12.197l0.031,0.188l0.84,0.265   c6.352,1.983,12.021,2.897,16.945,3.185v-3.683C17.818,49.773,23.212,42.936,30.589,40.741z"
    ],
    viewBox: "0 0 80.13 80.13"
  }
};

export default iconPaths;
