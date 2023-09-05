(function(){"use strict";class a{constructor(r,t=!0){this.tiles=r,this.difficulty=0,this.notes=[],t&&(this.notes=this.makeNotes())}getTile(r,t){let e=null;return this.tiles.forEach(i=>{i.row==r&&i.column==t&&(e=i)}),e}getCell(r){let t=[];return this.tiles.forEach(e=>{e.cell==r&&t.push(e)}),t}getRow(r){let t=[];for(let e=1;e<10;e++)t.push(this.getTile(r,e));return t}getColumn(r){let t=[];for(let e=1;e<10;e++)t.push(this.getTile(e,r));return t}makeNotes(){let r=[],t=729,e=81*9-1,i=1,o=[0,0];for(r=this.interpretNotes1(this.gatherNotes(r));i>0;)r=this.interpretNotes1(r),e=this.countPossibilities(r),i=t-e,o[0]+=i,i==0&&(r=this.interpretNotes2(r),i=e-this.countPossibilities(r),o[1]+=i),t=e;return t==0?this.difficulty=this.calcDifficulty(o[0],o[1]):this.difficulty=-1,r}calcDifficulty(r,t){return Math.round((r+500*t)/(r+t))}countPossibilities(r){let t=0;return r.forEach(e=>{e.notes.length>1&&(t+=e.notes.length-1)}),t}gatherNotes(r){let t=[];for(let e=0;e<9;e++)t.push(this.getCell(e));return t.forEach(e=>{e.forEach(i=>{typeof i.index!="number"&&r.push({cell:i.cell,row:i.row,column:i.column,notes:this.missing(e)})})}),r}interpretNotes1(r){let t=[];for(let s=1;s<10;s++)t.push(this.getRow(s));t.forEach((s,f)=>{let l=[];s.forEach(h=>{typeof h.index=="number"&&l.push(h.index)}),r.forEach(h=>{l.forEach(c=>{h.row==f+1&&h.notes.indexOf(c)>-1&&h.notes.splice(h.notes.indexOf(c),1)})})});let e=[];for(let s=1;s<10;s++)e.push(this.getColumn(s));e.forEach((s,f)=>{let l=[];s.forEach(h=>{typeof h.index=="number"&&l.push(h.index)}),r.forEach(h=>{l.forEach(c=>{h.column==f+1&&h.notes.indexOf(c)>-1&&h.notes.splice(h.notes.indexOf(c),1)})})});let i=[1,2,3,4,5,6,7,8,9],o=[];return i.forEach(s=>{let f=this.notesCol(r,s);f.forEach(l=>{l.notes.forEach(h=>{this.unique(f,h)&&o.push({cell:l.cell,row:l.row,column:l.column,index:h})})})}),i.forEach(s=>{let f=this.notesRow(r,s);f.forEach(l=>{l.notes.forEach(h=>{this.unique(f,h)&&o.push({cell:l.cell,row:l.row,column:l.column,index:h})})})}),o.forEach(s=>{this.unsetOthers(r,s)}),this.found(r).forEach(s=>{let f=this.notesRow(r,s.row);f.forEach(l=>{s.column!=l.column&&this.removeFromArray(l.notes,s.notes)}),f=this.notesCol(r,s.column),f.forEach(l=>{s.row!=l.row&&this.removeFromArray(l.notes,s.notes)})}),r}interpretNotes2(r){for(let t=1;t<10;t++){let e=this.notesCell(r.concat(),t-1),i=this.characteristics(e);e=this.addIndexToNotes(e,2,t-1),this.found(e).length<9&&i.forEach(o=>{o.col&&this.removeFromCell(r,null,o.col,t,[o.index]),o.row&&this.removeFromCell(r,o.row,null,t,[o.index])}),e=this.notesRow(r.concat(),t),i=this.characteristics(e),e=this.addIndexToNotes(e,0,t),this.found(e).length<9&&i.forEach(o=>{o.cell&&this.removeFromCell(r,o.row,null,-1*o.cell,[o.index])}),e=this.notesCol(r,t),i=this.characteristics(e),e=this.addIndexToNotes(e,1,t),this.found(e).length<9&&i.forEach(o=>{o.cell&&this.removeFromCell(r,null,o.col,-1*o.cell,[o.index])})}for(let t=1;t<10;t++)for(let e=0;e<9;e++){let i=this.notesCell(r,t),o=this.findDigitInNotes(i,e);o.length==1&&(o[0].notes=[e])}return r}isValid(r){let t=!0;return r.forEach(e=>{let i=this.getTile(e.row,e.column);e.notes.length==0&&typeof i.index!="number"&&(t=!1)}),t}unsetCell(r){this.getCell(r).forEach(e=>{e.index=""})}setCell(r){let t=this.getCell(r),e=[0,1,2,3,4,5,6,7,8],i=[],o=-1,n=0;n=0;let s=0;for(i=e.concat();i.length>0&&typeof t[n]!="undefined"&&s<200;)if(o=Math.round(Math.random()*(i.length-1)),s++,typeof i[o]!="undefined"&&this.isPossible(t[n],i[o],this.makeNotes())){let f=t[n++];f.index=i[o],i.splice(o,1)}return s<200}removeIndex(){let r=-1,t=-1,e=null,i="";for(;;)if(r=Math.round(Math.random()*8)+1,t=Math.round(Math.random()*8)+1,e=this.getTile(r,t),i="",typeof e.index=="number"){i=e.index,e.index="";break}return{row:r,col:t,index:i}}makeHints(r,t){let e=[],i=!0;for(let o=0;o<r;o++)e.push(this.removeIndex());return this.makeNotes(),this.difficulty==-1&&e.forEach(o=>{let n=this.getTile(o.row,o.col);n.index=o.index,i=!1}),i}generate(r=1){for(let n=0;n<9;n++)this.unsetCell(n);let t=0,e=0;for(let n=0;n<9;n++)for(t=0;!this.setCell(n)&&t++<200;)this.unsetCell(n);let i=[28,26,24,22],o=81-i[r-1];for(;e++<200&&!this.makeHints(o,r););return e>198&&this.generate(r),this.tiles.forEach(n=>{typeof n.index=="number"&&(n.initialValue=!0)}),this.tiles}getNote(r,t,e){let i=null;return r.forEach(o=>{o.row==t&&o.column==e&&(i=o)}),i}isPossible(r,t,e){return this.getNote(e,r.row,r.column).notes.indexOf(t)>-1}addIndexToNotes(r,t,e){let i=[];return this.tiles.forEach(o=>{typeof o.index=="number"&&(t==0&&e==o.row||t==1&&e==o.column||t==2&&e==o.cell)&&(o.notes=[o.index],i.push(o))}),r.concat(i)}notesCell(r,t){let e=[];return r.forEach(i=>{i.cell==t&&(e=e.concat(i))}),e}notesRow(r,t){let e=[];return r.forEach(i=>{i.row==t&&(e=e.concat(i))}),e}notesCol(r,t){let e=[];return r.forEach(i=>{i.column==t&&(e=e.concat(i))}),e}unsetOthers(r,t){r.forEach(e=>{e.row==t.row&&e.column==t.column?e.notes=[t.index]:(t.cell==e.cell&&e.notes.indexOf(t.index)>-1||t.row==e.row&&e.notes.indexOf(t.index)>-1||t.row==e.row&&e.notes.indexOf(t.index)>-1)&&e.notes.splice(e.notes.indexOf(t.index),1)})}allOnRow(r){let t=null;return r.forEach(e=>{e.notes.forEach(i=>{typeof t=="object"?t=e.row:t!=e.row?t=-1:t>-1&&(t=e.row)})}),typeof t=="object"?-1:t}allOnColumn(r){let t=null;return r.forEach(e=>{e.notes.forEach(i=>{typeof t=="object"?t=e.column:t!=e.column?t=-1:t>-1&&(t=e.column)})}),typeof t=="object"?-1:t}findDigitInNotes(r,t){let e=[];return r.forEach(i=>{i.notes.indexOf(t)>-1&&e.push(i)}),e}findIndentical(r){let t=[];return r.forEach((e,i)=>{r.forEach((o,n)=>{this.identical(e.notes,o.notes)&&n<i&&!this.contains(t,e)&&(t.push(e),t.push(o))})}),t}contains(r,t){return typeof r.find(i=>{if(i.row==t.row&&i.column==t.column)return i})!="undefined"}found(r){let t=[];return r.forEach(e=>{e.notes.length==1&&t.push(e)}),t}missing(r){let t=[0,1,2,3,4,5,6,7,8];return r.forEach(e=>{typeof e.index=="number"&&t.splice(t.indexOf(e.index),1)}),t}occurences(r,t){let e=0;return r.forEach(i=>{i.notes.forEach(o=>{o===t&&e++})}),e}identical(r,t){let e=[];return r.forEach(i=>{e.push(i)}),t.forEach(i=>{e.indexOf(i)>-1?e.splice(e.indexOf(i),1):e.push(null)}),e.length===0}characteristics(r){let t=[0,1,2,3,4,5,6,7,8],e=[];return t.forEach(i=>{let o=[],n=[],s=[];r.forEach(f=>{f.notes.forEach(l=>{o.indexOf(f.row)==-1&&l==i&&o.push(f.row),n.indexOf(f.column)==-1&&l==i&&n.push(f.column),s.indexOf(f.cell)==-1&&l==i&&s.push(f.cell+1)})}),o.length==1&&e.push({index:i,row:o[0]}),n.length==1&&e.push({index:i,col:n[0]}),s.length==1&&e.push({index:i,cell:s[0]})}),e}notTaken(r){let t=[0,1,2,3,4,5,6,7,8];return r.forEach(e=>{typeof e.index=="number"&&t.splice(t.indexOf(e.index),1)}),t}removeFromCell(r,t,e,i,o){r.forEach(n=>{typeof t=="number"?typeof i=="number"?i>0?n.cell!=i-1&&n.row==t&&this.removeFromArray(n.notes,o):n.cell==-1*i-1&&n.row!=t&&this.removeFromArray(n.notes,o):n.row!=t&&this.removeFromArray(n.notes,o):typeof e=="number"&&(typeof i=="number"?i>0?n.cell!=i-1&&n.column==e&&this.removeFromArray(n.notes,o):n.cell==-1*i-1&&n.column!=e&&this.removeFromArray(n.notes,o):n.column!=e&&this.removeFromArray(n.notes,o))})}removeFromArray(r,t){t.forEach(e=>{r.indexOf(e)>-1&&r.splice(r.indexOf(e),1)})}unique(r,t){return this.occurences(r,t)===1}uniqueNotes(r){let t=!0;return r.forEach((e,i)=>{r.forEach((o,n)=>{n<i&&this.identical(e.notes,o.notes)&&(t=!1)})}),t}getDifficulty(){return this.isValid(this.notes)?this.difficulty:-1}getNotes(){return this.notes}}var d={sudoku:a};addEventListener("message",u=>{let r=new d.sudoku(u.data.tiles);postMessage({tiles:r.generate(u.data.d),d:r.getDifficulty()})})})();
