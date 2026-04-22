from langgraph.graph import StateGraph, END

from graph.state import MedifyState

from nodes.ingestion_node import ingestion_node
from nodes.gate_node import gate_node
from nodes.extraction_node import extraction_node
from nodes.explanation_node import explanation_node
from nodes.rootcause_node import rootcause_node
from nodes.diet_node import diet_node
from nodes.critic_node import critic_node
from nodes.synthesis_node import synthesis_node


builder = StateGraph(MedifyState)

# ---------------- NODES ----------------
builder.add_node("ingestion", ingestion_node)
builder.add_node("gate", gate_node)
builder.add_node("extract", extraction_node)

builder.add_node("explain", explanation_node)
builder.add_node("rootcause", rootcause_node)

builder.add_node("diet", diet_node)
builder.add_node("critic", critic_node)
builder.add_node("synthesis", synthesis_node)

# ---------------- ENTRY ----------------
builder.set_entry_point("ingestion")

# ---------------- FLOW ----------------
builder.add_edge("ingestion", "gate")

# ----- Gate condition -----
def route_after_gate(state: MedifyState):
    if state.get("rejected"):
        return END
    return "extract"

builder.add_conditional_edges("gate", route_after_gate)

# ----- Extraction -----
builder.add_edge("extract", "explain")
builder.add_edge("extract", "rootcause")

# ----- Merge parallel → Diet -----
builder.add_edge("explain", "diet")
builder.add_edge("rootcause", "diet")

# ----- Then sequential -----
builder.add_edge("diet", "critic")
builder.add_edge("critic", "synthesis")

# ----- End -----
builder.add_edge("synthesis", END)

# ---------------- COMPILE ----------------
medify_graph = builder.compile()