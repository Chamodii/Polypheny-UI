import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/draggable';
import {KEYS, TREE_ACTIONS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import {Router} from '@angular/router';
import {LeftSidebarService} from './left-sidebar.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})

//docs: https://angular2-tree.readme.io/docs/
export class LeftSidebarComponent implements OnInit , AfterViewInit {

  @ViewChild('tree') treeComponent: TreeComponent;
  nodes;
  options;
  error;

  constructor(
    _router:Router,
    _sidebar: LeftSidebarService,
  ) {
    //this.nodes = nodes;
    this.options = {
      actionMapping: {
        mouse: {
          dblClick: (tree, node, $event) => {
            /*if (node.hasChildren) {
              TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
            }*/
          },
          click: (tree, node, $event) => {
            if (node.hasChildren){
              TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
              if( _sidebar.action !== null ){
                _sidebar.action( node );
              }else{
                if( node.data.routerLink !== '' ){
                  _router.navigate([node.data.routerLink]);
                  node.setIsActive(true);
                }
              }
            }
            else if ( ! node.hasChildren){
              if( _sidebar.action !== null ){
                _sidebar.action( node );
              }else {
                if (node.data.routerLink !== '') {
                  _router.navigate([node.data.routerLink]);
                  node.setIsActive(true);
                }
              }
            }
          }
        },
      },
      allowDrag: true,
      allowDrop: false
    };

    _sidebar.getNodes().subscribe(
      nodes => {
        this.nodes = nodes;
      }
    );

    _sidebar.getError().subscribe(
      error => {
        this.error = error;
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const treeModel: TreeModel = this.treeComponent.treeModel;
    // treeModel.setState({id: 1, name: 'test'});// not working yet
    //todo is not working:
    this.treeComponent.treeModel.expandAll();//expand by default

    // todo 2-way-binding https://angular2-tree.readme.io/docs/save-restore

    $('#search-tree').on('keyup', function(e) {
      if (e.which === 27) { // esc
        $(this).val('');
      }
      treeModel.filterNodes((node) => {
        return node.data.name.startsWith($(this).val());
      });
    });

  }

}
