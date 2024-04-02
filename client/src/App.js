import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Import Navigate and Outlet
import Signin from './pages/Signin.js';
import Signup from './pages/Signup.js';
import TaskList from './components/Home.js';
import Navbar from './components/Navbar.js';
import Group from './components/Group/Group.js';

export default function App() {
  const isLoggedIn = localStorage.getItem('userToken');
  console.log("User Details", isLoggedIn)
  return (
    <Router>
      <Navbar />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/create" element={<Group />} />
            <Route path="/" element={<TaskList />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/signin" />} />
        )}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}


// #include <bits/stdc++.h> 
// /*************************************************************

//     Following is the Binary Tree node structure

//     class BinaryTreeNode
//     {
//     public :
//         T data;
//         BinaryTreeNode < T > *left;
//         BinaryTreeNode < T > *right;

//         BinaryTreeNode(T data) {
//             this -> data = data;
//             left = NULL;
//             right = NULL;
//         }
//     };

// *************************************************************/
// void answer(BinaryTreeNode<int>* &root){
//     if(!root) return ;
//     int child=0;
//     if(root->left) child+=root->left->data;
//     if(root->right) child+=root->right->data;
//     if(root->data>child) {
//         if(root->left) root->left->data=root->data;
//         else if(root->right) root->right->data=root->data;
//     }
//     answer(root->left);
//     answer(root->right);
//     int total=0;
//     if(root->left) total=root->left+data;
//     if(root->right) total=root->right->data;
//     if(root->left || root->right) root->data=total;
// }
// void changeTree(BinaryTreeNode < int > * root) {
//     // Write your code here.
//     if(!root) return;
//     answer(root);
// }  