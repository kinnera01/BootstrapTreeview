
var object = [{
  topicName: "C",
  questionCount: "150",
  listoftags: [{
    topicName: "data types & operators",
    questionsCount: "392",
    // def: "hey",
    listoftags: [{
      topicName: "operators",
      
  },{
    topicName: "Logical",
  },
  { topicName: "operators"
}
]},{
    topicName: "data",
    questionsCount: "15",
    listoftags: [{
      topicName: "xya",
    }]
  }]
}, {
  topicName: "JAVA",
  questionCount: "50",
  listoftags: [{
    topicName: "data types & operators",
    questionsCount: "15",
    // def: "hey",
    listoftags: [{
      topicName: "xya",
    }]
  }]
}]
// initialization of empty data array 
var data = [];
// to check if child is present and push it
function getchilddata(listoftags) {
  var nodes = [];
  for (var i = 0; i < listoftags.length; i++) {
    //   console.log(listoftags[i])
    var name = listoftags[i].topicName;
    var badgecount = listoftags[i].questionsCount;
    var tooltipdata = listoftags[i].def;
    //for grandchildren
    var nodes1 = [];
    if ("listoftags" in listoftags[i]) {     
     nodes1 = getchilddata(listoftags[i].listoftags);
     //todisable grandchildren
     nodes1.forEach(function(item){item.state = {disabled:true};});
    console.log(nodes1);
    }
    var childdata = {
      text: name,
      tags: [badgecount],
      def: tooltipdata,
    }
    if (nodes1.length != 0) {
      childdata.nodes = nodes1;
    }
    nodes.push(childdata);
  }
  return nodes;
}
//to get data from object
object.forEach(function (element) {
  var name = element.topicName;
  var tagno = element.questionCount;
  if ("listoftags" in element) {
    var nodes = getchilddata(element.listoftags);
  }
  // console.log(nodes);
  var currdata = {
    text: name,
    tags: [tagno],
    nodes: nodes,
    state:{
        expanded:false,
    },
  }
  data.push(currdata);
})
//to print events
console.log(data)
var $checkableTree = $('#treeview-checkable').treeview({
  data: data,
  expanded: false,
  showIcon: true,
  selectedColor: '#FFFFFF',
  expandIcon: 'glyphicon glyphicon-chevron-right',
  collapseIcon: 'glyphicon glyphicon-chevron-down',
  showCheckbox: true,
  highlightSelected: false,
  showTags: true,
  showTip: true,

  onNodeChecked: function (event, node) {
    $('#checkable-output').prepend('<p>' + node.text + ' was checked</p>');
  },
  onNodeUnchecked: function (event, node) {
    $('#checkable-output').prepend('<p>' + node.text + ' was unchecked</p>');
  }
  
});
$('#treeview-checkable').on('nodeSelected', function (event, data) {
  console.log(data);
  var nodeId = data.nodeId;
  //to expand elements on node selection
  $('#treeview-checkable').treeview('toggleNodeExpanded', [nodeId, {
    silent: true
  }]);   
});
//on node checked
$('#treeview-checkable').on('nodeChecked', function (event, data) {
  var nodeId = data.nodeId;
  //to check if parentId exists
  var parentId = -1;
  if ('parentId' in data) {
    parentId = data.parentId;
  }
  //to expand elements on click of checkbox selection
  $('#treeview-checkable').treeview('expandNode', [nodeId, {
    silent: true,
    ignoreChildren: false
  }]);
  //if parentId exists select parentId on selection of child
  if (parentId !== -1) {
    $('#treeview-checkable').treeview('checkNode', [parentId, {
      silent: true
    }]);
  }
});
//on uncheck parent uncheck child and viseversa..
$('#treeview-checkable').on('nodeUnchecked', function (event, data) {
  //to get childern nodes in parent node
  for (i in data.nodes) {
    var nodeId = data.nodes[i].nodeId;
    //to see if its parent or child as parent has tags so if tags is not equal to 0 then uncheck node
    if (data.tags[0] !== "0") {
      $('#treeview-checkable').treeview('uncheckNode', [nodeId, { silent: true }]);
    }
  }
  //to check if allchildren are unchecked uncheck parent 
  var siblings = $('#treeview-checkable').treeview('getSiblings', data);
  var parentId = data.parentId;
  var allchildunchecked = true;
  //getting status of child element
  for (i in siblings) {
    // console.log(siblings[i].state.checked);
    if (siblings[i].state.checked == true) {
      allchildunchecked = false;
    }
  }
  if (allchildunchecked == true) {
    $('#treeview-checkable').treeview('uncheckNode', [parentId, { silent: true }]);
    $('#treeview-checkable').treeview('collapseNode', [parentId, {
      silent: true,
      ignoreChildren: false
    }]);
  }
  
})
