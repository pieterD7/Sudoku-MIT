(function(){"use strict";class a{constructor(i,t=!0){this.tiles=i,this.difficulty=0,this.notes=[],t&&(this.notes=this.makeNotes())}getTile(i,t){let e=null;return this.tiles.forEach(o=>{if(o.row==i&&o.column==t){e=o;return}}),e}getCell(i){let t=[];return this.tiles.forEach(e=>{e.cell==i&&t.push(e)}),t}getRow(i){let t=[];for(let e=1;e<10;e++)t.push(this.getTile(i,e));return t}getColumn(i){let t=[];for(let e=1;e<10;e++)t.push(this.getTile(e,i));return t}makeNotes(){let i=[],t=729,e=81*9-1,o=1,r=[0,0];for(i=this.interpretNotes1(this.gatherNotes(i));o>0;)i=this.interpretNotes1(i),e=this.countPossibilities(i),o=t-e,r[0]+=o,o==0&&(i=this.interpretNotes2(i),o=e-this.countPossibilities(i),r[1]+=o),t=e;return t==0?this.difficulty=this.calcDifficulty(r[0],r[1]):this.difficulty=-1,i}calcDifficulty(i,t){return Math.round((i+40*t)/(i+t))}countPossibilities(i){let t=0;return i.forEach(e=>{e.notes.length>1&&(t+=e.notes.length-1)}),t}gatherNotes(i){let t=[];for(let e=0;e<9;e++)t.push(this.getCell(e));return t.forEach(e=>{e.forEach(o=>{typeof o.index!="number"&&i.push({cell:o.cell,row:o.row,column:o.column,notes:this.missing(e)})})}),i}interpretNotes1(i){let t=[];for(let n=1;n<10;n++)t.push(this.getRow(n));t.forEach((n,f)=>{let s=[];n.forEach(h=>{typeof h.index=="number"&&s.push(h.index)}),i.forEach(h=>{s.forEach(c=>{h.row==f+1&&h.notes.indexOf(c)>-1&&h.notes.splice(h.notes.indexOf(c),1)})})});let e=[];for(let n=1;n<10;n++)e.push(this.getColumn(n));e.forEach((n,f)=>{let s=[];n.forEach(h=>{typeof h.index=="number"&&s.push(h.index)}),i.forEach(h=>{s.forEach(c=>{h.column==f+1&&h.notes.indexOf(c)>-1&&h.notes.splice(h.notes.indexOf(c),1)})})});let o=[1,2,3,4,5,6,7,8,9],r=[];return o.forEach(n=>{let f=this.notesCol(i,n);f.forEach(s=>{s.notes.forEach(h=>{this.unique(f,h)&&r.push({cell:s.cell,row:s.row,column:s.column,index:h})})})}),o.forEach(n=>{let f=this.notesRow(i,n);f.forEach(s=>{s.notes.forEach(h=>{this.unique(f,h)&&r.push({cell:s.cell,row:s.row,column:s.column,index:h})})})}),r.forEach(n=>{this.unsetOthers(i,n)}),this.found(i).forEach(n=>{let f=this.notesRow(i,n.row);f.forEach(s=>{n.column!=s.column&&this.removeFromArray(s.notes,n.notes)}),f=this.notesCol(i,n.column),f.forEach(s=>{n.row!=s.row&&this.removeFromArray(s.notes,n.notes)})}),i}interpretNotes2(i){for(let t=1;t<10;t++){let e=this.notesRow(i,t),o=this.notTaken(this.getRow(t));e.length>0&&o.length>0&&e.length<4&&o.length<4&&this.removeFromCell(this.notesCell(i,e[0].cell),t,null,o);let r=this.notesCol(i,t),l=this.notTaken(this.getColumn(t));r.length>0&&l.length>0&&r.length<4&&l.length<4&&this.removeFromCell(this.notesCell(i,r[0].cell),null,t,l)}for(let t=1;t<10;t++){let e=[];this.notesCell(i,t).forEach(r=>{r.notes.length==2&&e.push(r)}),e=this.findIndentical(e),e.length==2&&(e[0].row==e[1].row?this.notesRow(i,e[0].row).forEach(l=>{e[0].column!=l.column&&e[1].column!=l.column&&this.removeFromArray(l.notes,e[0].notes)}):e[0].column==e[1].column&&this.notesCol(i,e[0].column).forEach(l=>{e[0].row!=l.row&&e[1].row!=l.row&&this.removeFromArray(l.notes,e[0].notes)}))}for(let t=1;t<10;t++){let e=this.notesCell(i,t);for(let o=0;o<9;o++){let r=this.findDigitInNotes(e,o),l=this.allOnRow(r);l>-1&&r.length>1&&this.notesRow(i,l).forEach(s=>{s.cell!=r[0].cell&&this.removeFromArray(s.notes,[o])});let n=this.allOnColumn(r);n>-1&&r.length>1&&this.notesCol(i,n).forEach(s=>{s.cell!=r[0].cell&&this.removeFromArray(s.notes,[o])})}}for(let t=1;t<10;t++)for(let e=0;e<9;e++){let o=this.notesCell(i,t),r=this.findDigitInNotes(o,e);r.length==1&&(r[0].notes=[e])}for(let t=1;t<10;t++)for(let e=0;e<9;e++){let o=this.notesCell(i,t),r=this.findDigitInNotes(o,e),l=[];if(this.uniqueNotes(r)&&r.length==2&&(r.forEach(n=>{let f=n.notes.concat();f.splice(f.indexOf(e),1),o.forEach(s=>{this.identical(s.notes,f)&&(s.row==n.row||s.column==n.column)&&l.push(n)})}),l.length==1)){let n=l[0].row,f=l[0].column;r.forEach(s=>{(s.row!=n||s.column!=f)&&s.notes.length>1&&(s.notes=[e])})}}return i}isValid(i){let t=!0;return i.forEach(e=>{let o=this.getTile(e.row,e.column);e.notes.length==0&&typeof o.index!="number"&&(t=!1)}),t}unsetCell(i){this.getCell(i).forEach(e=>{e.index=""})}setCell(i){let t=this.getCell(i),e=[0,1,2,3,4,5,6,7,8],o=[],r=-1,l=0;l=0;let n=0;for(o=e.concat();o.length>0&&n<200;)if(r=Math.round(Math.random()*8),n++,typeof o[r]!="undefined"&&typeof t[l]!="undefined"&&this.isPossible(t[l],o[r],this.makeNotes())){let f=t[l++];f.index=o[r],o.splice(r,1)}return n<200}removeIndex(){let i=-1,t=-1,e=null,o="";for(;;)if(i=Math.round(Math.random()*8+1),t=Math.round(Math.random()*8+1),e=this.getTile(i,t),o="",typeof e.index=="number"){o=e.index,e.index="";break}return{row:i,col:t,index:o}}makeHints(i,t){let e=[],o=!0;for(let r=0;r<i;r++)e.push(this.removeIndex());return this.makeNotes(),(this.difficulty>t+.5||this.difficulty<t)&&e.forEach(r=>{let l=this.getTile(r.row,r.col);l.index=r.index,o=!1}),o}generate(i=1){for(let l=0;l<9;l++)this.unsetCell(l);let t=0,e=0;for(let l=0;l<9;l++)for(t=0;!this.setCell(l)&&t++<200;)this.unsetCell(l);let o=[28,26,24,22],r=81-o[i-1];for(;e++<200&&!this.makeHints(r,i););return e>198&&this.generate(i),this.tiles.forEach(l=>{typeof l.index=="number"&&(l.initialValue=!0)}),this.tiles}getNote(i,t,e){let o=null;return i.forEach(r=>{r.row==t&&r.column==e&&(o=r)}),o}isPossible(i,t,e){return this.getNote(e,i.row,i.column).notes.indexOf(t)>-1}notesCell(i,t){let e=[];return i.forEach(o=>{o.cell==t&&(e=e.concat(o))}),e}notesRow(i,t){let e=[];return i.forEach(o=>{o.row==t&&(e=e.concat(o))}),e}notesCol(i,t){let e=[];return i.forEach(o=>{o.column==t&&(e=e.concat(o))}),e}unsetOthers(i,t){i.forEach(e=>{e.row==t.row&&e.column==t.column?e.notes=[t.index]:(t.cell==e.cell&&e.notes.indexOf(t.index)>-1||t.row==e.row&&e.notes.indexOf(t.index)>-1||t.row==e.row&&e.notes.indexOf(t.index)>-1)&&e.notes.splice(e.notes.indexOf(t.index),1)})}allOnRow(i){let t=null;return i.forEach(e=>{e.notes.forEach(o=>{typeof t=="object"?t=e.row:t!=e.row?t=-1:t>-1&&(t=e.row)})}),typeof t=="object"?-1:t}allOnColumn(i){let t=null;return i.forEach(e=>{e.notes.forEach(o=>{typeof t=="object"?t=e.column:t!=e.column?t=-1:t>-1&&(t=e.column)})}),typeof t=="object"?-1:t}findDigitInNotes(i,t){let e=[];return i.forEach(o=>{o.notes.indexOf(t)>-1&&e.push(o)}),e}findIndentical(i){let t=[];return i.forEach((e,o)=>{i.forEach((r,l)=>{this.identical(e.notes,r.notes)&&l<o&&!this.contains(t,e)&&(t.push(e),t.push(r))})}),t}contains(i,t){return typeof i.find(o=>{if(o.row==t.row&&o.column==t.column)return o})!="undefined"}found(i){let t=[];return i.forEach(e=>{e.notes.length==1&&t.push(e)}),t}missing(i){let t=[0,1,2,3,4,5,6,7,8];return i.forEach(e=>{typeof e.index=="number"&&t.splice(t.indexOf(e.index),1)}),t}occurences(i,t){let e=0;return i.forEach(o=>{o.notes.forEach(r=>{r===t&&e++})}),e}identical(i,t){let e=[];return i.forEach(o=>{e.push(o)}),t.forEach(o=>{e.indexOf(o)>-1?e.splice(e.indexOf(o),1):e.push(null)}),e.length===0}notTaken(i){let t=[0,1,2,3,4,5,6,7,8];return i.forEach(e=>{typeof e.index=="number"&&t.splice(t.indexOf(e.index),1)}),t}removeFromCell(i,t,e,o){i.forEach(r=>{typeof t=="number"?r.row!=t&&this.removeFromArray(r.notes,o):typeof e=="number"&&r.column!=e&&this.removeFromArray(r.notes,o)})}removeFromArray(i,t){t.forEach(e=>{i.indexOf(e)>-1&&i.splice(i.indexOf(e),1)})}unique(i,t){return this.occurences(i,t)===1}uniqueNotes(i){let t=!0;return i.forEach((e,o)=>{i.forEach((r,l)=>{l<o&&this.identical(e.notes,r.notes)&&(t=!1)})}),t}getDifficulty(){return this.isValid(this.notes)?this.difficulty:-1}getNotes(){return this.notes}}var d={sudoku:a};addEventListener("message",u=>{let i=new d.sudoku(u.data.tiles);postMessage({tiles:i.generate(u.data.d),d:i.getDifficulty()})})})();