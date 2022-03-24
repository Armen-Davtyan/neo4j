
import React, {useState,useEffect} from "react"
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import styles from '../styles/Home.module.css'
import { useQuery, gql } from "@apollo/client";
import _ from "lodash";





const mostRecentQuery = gql`
  {
    articles(options: { limit: 5, sort: { created: DESC } }) {
      __typename
      id
      title
      created
      url
      user {
        __typename
        username
        avatar
      }
    }
  }
`;


const formatData = (data) => {
    const nodes = [];
    const links = [];
    if (!data.articles) {
      return { nodes, links };
    }
  
    data.articles.forEach((a) => { 
      nodes.push({
        id: a.id,
        __typename: a.__typename,
        data : {
            id: a.user.username,
            avatar: a.user.avatar,
            __typename: a.user.__typename,
            label: a.title,
        },
      });
  
      links.push({
        data: {
          source: a.user.username,
          target: a.user.avatar,
          created: a.created,
        }
      });
    });
  
    return {
      nodes: _.uniqBy(nodes, "id"),
      links,
    };
  };


 
cytoscape.use( coseBilkent );
 
const Home =() => {
    

const [graphData, setGraphData] = useState({ nodes: [], links: [] });

const { data } = useQuery(mostRecentQuery, {
    onCompleted: (data) => setGraphData(formatData(data)),
  });



console.log(graphData,'graphData')
console.log(data)

const elements = {
    nodes: graphData.nodes,
    edge: graphData.links
    // nodes: [
    //     { data: { id: "j", name: "Bill" } },
    //     { data: { id: "e", name: "Bob" } },
    //     { data: { id: "k", name: "Sue" } },
    //     { data: { id: "g", name: "Mary" } }
    //   ],
    //   edges: [
    //     { data: { source: "j", target: "k" } },
    //     { data: { source: "j", target: "k" } },
    //     { data: { source: "j", target: "g" } },
    //     { data: { source: "e", target: "j" } },
    //     { data: { source: "e", target: "k" } },
    //     { data: { source: "k", target: "j" } },
    //     { data: { source: "k", target: "e" } },
    //     { data: { source: "k", target: "g" } },
    //     { data: { source: "g", target: "j" } }
    //   ]
  }


//   console.log(graphData);
  useEffect(() => {
    const ciId = document.getElementById('cy')

    const cy = cytoscape({
      container: ciId, 
      elements,
      style: [
        {
          selector: 'node',
          style: {
            height: 100,
            width: 100,
            label: "data(label)",
            "text-halign": "center",
            "text-valign": "center",
            "font-size": 8,
            "text-wrap": "wrap",
            'background-color': '#1E90FF',
            'border-color': '#B22222',
            'border-width': '8',
            "text-max-width": 50,
          }
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "target-arrow-shape": "triangle",
            "line-color": "green",
            "target-arrow-color": "red",
            "curve-style": "bezier"
          }
        }
      ],
    
      layout: {
        name: 'breadthfirst',
        rows: 8
      }
    
    });
  });
 
  return (
 
    <>
      <div id="cy" className={styles.cy}></div>
    </>
  )
}
 
export default Home
