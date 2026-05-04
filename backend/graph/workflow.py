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
from graph.state import MedifyState
from nodes.safety_node import safety_node

builder = StateGraph(MedifyState)

# Nodes
builder.add_node("ingestion", ingestion_node)
builder.add_node("gate", gate_node)
builder.add_node("extract", extraction_node)
builder.add_node("explain", explanation_node)
builder.add_node("rootcause", rootcause_node)
builder.add_node("diet", diet_node)
builder.add_node("safety", safety_node)
builder.add_node("critic", critic_node)
builder.add_node("synthesis", synthesis_node)

# ---------------- ENTRY ----------------
builder.set_entry_point("ingestion")

# ---------------- FLOW ----------------
builder.add_edge("ingestion", "gate")

def route_after_gate(state: MedifyState):
    if state.get("rejected"): return END
    return "extract"

builder.add_conditional_edges("gate", route_after_gate)

builder.add_edge("extract", "explain")
builder.add_edge("extract", "rootcause")
builder.add_edge("explain", "diet")
builder.add_edge("rootcause", "diet")

# Diet -> Safety -> Critic
builder.add_edge("diet", "safety")
builder.add_edge("safety", "critic")


# ----- THE AGENTIC LOOP -----
def route_after_critic(state: MedifyState):
    critic_res = state.get("critic_result", {})
    rev_count = state.get("revision_count", 0)
    
    # If critic says it's bad AND we haven't tried too many times (max 3)
    if critic_res.get("needs_revision") and rev_count < 3:
        print(f"--REVISION LOOP: Attempt {rev_count} ---")
        return "diet" # Send it back to the diet node to fix
    
    return "synthesis" # If it's good OR we've tried 3 times, move to final report

builder.add_conditional_edges("critic", route_after_critic)
# ----------------------------

builder.add_edge("synthesis", END)

medify_graph = builder.compile()