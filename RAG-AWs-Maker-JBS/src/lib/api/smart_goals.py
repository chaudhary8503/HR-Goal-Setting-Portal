import os
import json
import time
import re
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from sympy import true




class SMARTGoalsGenerator:
    def __init__(self, api_key=None, prompts_path = Path(__file__).parent.parent / "utils" / "prompts.json"):
        api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Gemini API key must be provided as parameter or environment variable")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.7,
            max_output_tokens=2000,
            google_api_key=api_key
        )
        self.prompts_data = self._load_prompts(prompts_path)
        self.template = (
            "Context: {context}\n"
            "Instructions: Generate 3 SMART goals as a JSON array with fields: "
            "title, description, kpi, companyTopBetAlignment, framework3E, coreValue. "
            "Each goal must be concise and specific, measurable, achievable, relevant, time-bound, "
            "and aligned with the most relevant company bet, 3E framework, and core value. "
            "For each goal, the 'kpi' field should include both the KPI metric and the KPI points system (maximum 5 points per goal), dont make the kpi points sytem different but include it under the kpi field only  followed in bullets:\n"
            "- 5 points: Significantly exceed the goal or achieve it much faster than planned\n"
            "- 4 points: Exceed the goal\n"
            "- 3 points: Fully achieve the goal as planned\n"
            "- 2 points: Partially achieve the goal\n"
            "- 1 point: Underperform or do not achieve the goal\n"
            "This KPI points system will be used for end-of-year performance reviews and bonuses, so make it clear and relevant for each goal. Also, ensure each goal addresses the manager's goal."
        )

    def _load_prompts(self, path):
        try:
            with open(path, "r") as file:
                return json.load(file)
        except Exception:
            print("error mate")
            return {}

    def build_context(self, job_title, department, goal_description, key_results, deadline, managers_goal):
        examples = self.prompts_data.get(department.lower(), {}).get("examples", [])
        core_values = self.prompts_data.get("core_values", [])
        framework_3e = self.prompts_data.get("framework_3e", [])
        company_top_bets = self.prompts_data.get("company_top_bets", [])
        return (
            f"Job Title: {job_title}\n"
            f"Department: {department}\n"
            f"Goal Description: {goal_description}\n"
            f"Key Results: {key_results}\n"
            f"Deadline: {deadline}\n"
            f"Manager's Goal: {managers_goal}\n"
            f"Example Goals: {examples}\n"
            f"Core Values: {core_values}\n"
            f"3E Strategic Framework: {framework_3e}\n"
            f"Company Top Bets: {company_top_bets}"
        )

    def generate_smart_goals(self, job_title, department, goal_description, key_results, deadline, managers_goal, max_retries=3):
        context = self.build_context(job_title, department, goal_description, key_results, deadline, managers_goal)
        prompt = PromptTemplate(input_variables=["context"], template=self.template)
        chain = LLMChain(llm=self.llm, prompt=prompt)
        for attempt in range(max_retries):
            try:
                output = chain.invoke({"context": context})
                print("LLM output:", output)
                llm_text = output['text'] if isinstance(output, dict) else output
                llm_text = self._clean_llm_output(llm_text)


                # The output of the LLM should be a JSON array
                '''
                    [
                    {'title': 'tit...',
                     'description': 'des..',
                      'kpi': 'Incr...',
                      'companyTopBetAlignment': 'TRANSF...',
                      'framework3E': 'EXPA..',
                        'coreValue': 'Si...s.'}, 

                    {'title': 'Impl..n', 
                    'description': 'Int...', 
              .....
                    ]
                '''




                return json.loads(llm_text)
            except Exception as e:
                if attempt == max_retries - 1:
                    return self._fallback_goals(job_title, department, goal_description, key_results, deadline)
                time.sleep(2 ** attempt)


    def _update_user_goal(self, goal, comment, max_retries=3):
        """
        Update a user's goal based on their feedback/comment using the LLM
        
        Args:
            goal (dict): The original goal with fields like title, description, kpi, etc.
            comment (str): User's feedback/instruction on how to modify the goal
            max_retries (int): Number of retry attempts if LLM fails
        
        Returns:
            dict: Updated goal with same structure as input
        """
        
        # Create the update template
        update_template = (
            "You are tasked with updating a SMART goal based on user feedback.\n\n"
            "Original Goal:\n"
            "Title: {original_title}\n"
            "Description: {original_description}\n"
            "KPI: {original_kpi}\n"
            "Company Top Bet Alignment: {original_alignment}\n"
            "3E Framework: {original_framework}\n"
            "Core Value: {original_core_value}\n\n"
            "User's Update Request: {user_comment}\n\n"
            "Core Values Available: {core_values}\n"
            "3E Strategic Framework Options: {framework_3e}\n"
            "Company Top Bets: {company_top_bets}\n\n"
            "Instructions:\n"
            "1. Update the goal based on the user's feedback while maintaining SMART criteria\n"
            "2. Keep the goal specific, measurable, achievable, relevant, and time-bound\n"
            "3. Ensure alignment with appropriate company values, framework, and top bets\n"
            "4. For the KPI field, include both the metric and the 5-point scoring system:\n"
            "   - 5 points: Significantly exceed the goal or achieve it much faster than planned\n"
            "   - 4 points: Exceed the goal\n"
            "   - 3 points: Fully achieve the goal as planned\n"
            "   - 2 points: Partially achieve the goal\n"
            "   - 1 point: Underperform or do not achieve the goal\n\n"
            "Return ONLY a valid JSON object with the updated goal containing these exact fields:\n"
            "title, description, kpi, companyTopBetAlignment, framework3E, coreValue"
        )
        
        # Prepare the context data
        core_values = self.prompts_data.get("core_values", [])
        framework_3e = self.prompts_data.get("framework_3e", [])
        company_top_bets = self.prompts_data.get("company_top_bets", [])
        
        # Create the prompt
        prompt = PromptTemplate(
            input_variables=[
                "original_title", "original_description", "original_kpi", 
                "original_alignment", "original_framework", "original_core_value",
                "user_comment", "core_values", "framework_3e", "company_top_bets"
            ],
            template=update_template
        )
        
        # Create the chain
        chain = LLMChain(llm=self.llm, prompt=prompt)
        
        # Attempt to update the goal with retries
        for attempt in range(max_retries):
            try:
                # Invoke the LLM
                output = chain.invoke({
                    "original_title": goal.get("title", ""),
                    "original_description": goal.get("description", ""),
                    "original_kpi": goal.get("kpi", ""),
                    "original_alignment": goal.get("companyTopBetAlignment", ""),
                    "original_framework": goal.get("framework3E", ""),
                    "original_core_value": goal.get("coreValue", ""),
                    "user_comment": comment,
                    "core_values": core_values,
                    "framework_3e": framework_3e,
                    "company_top_bets": company_top_bets
                })
                
                print("LLM update output:", output)
                
                # Extract the text from the output
                llm_text = output['text'] if isinstance(output, dict) else output
                llm_text = self._clean_llm_output(llm_text)
                
                # Parse the JSON response
                updated_goal = json.loads(llm_text)
                
                # Validate that all required fields are present
                required_fields = ['title', 'description', 'kpi', 'companyTopBetAlignment', 'framework3E', 'coreValue']
                if all(field in updated_goal for field in required_fields):
                    print(f"Goal successfully updated: {updated_goal['title']}")
                    return updated_goal
                else:
                    raise ValueError("Missing required fields in updated goal")
                    
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    # If all retries failed, return a minimally updated version
                    print("All update attempts failed, returning goal with minor modification")
                    return self._fallback_update(goal, comment)
                time.sleep(2 ** attempt)  # Exponential backoff
        
        # This should never be reached, but just in case
        return self._fallback_update(goal, comment)

    def _fallback_update(self, goal, comment):
        """
        Fallback method when LLM update fails - makes minimal changes to the goal
        """
        updated_goal = goal.copy()
        
        # Add a note to the description indicating it was updated based on user feedback
        current_desc = updated_goal.get("description", "")
        updated_goal["description"] = f"{current_desc} (Updated based on feedback: {comment[:100]}...)" if len(comment) > 100 else f"{current_desc} (Updated based on feedback: {comment})"
        
        # Add timestamp to title to show it was modified
        from datetime import datetime
        timestamp = datetime.now().strftime("%m/%d")
        current_title = updated_goal.get("title", "")
        updated_goal["title"] = f"{current_title} (Modified {timestamp})"
        
        return updated_goal


    def _clean_llm_output(self, llm_text):
        """
        Extract JSON array from LLM output, even if wrapped in markdown code block.
        """
        # Remove markdown code block if present
        match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", llm_text)
        if match:
            llm_text = match.group(1)
        # Remove any leading/trailing whitespace
        llm_text = llm_text.strip()
        # Optionally, remove trailing commas (for safety)
        llm_text = re.sub(r",\s*([\]}])", r"\1", llm_text)
        return llm_text

    def _fallback_goals(self, job_title, department, goal_description, key_results, deadline):
        return [
            {
                "title": "Achieve Primary Objective Through Strategic Planning",
                "description": f"Develop and execute a plan to {goal_description.lower()} by {deadline}, focusing on {key_results}.",
                "kpi": f"100% completion of planned milestones by {deadline}",
                "companyTopBetAlignment": "INVESTING FOR SCALE",
                "framework3E": "ELEVATE",
                "coreValue": "CORE VAL-4"
            },
            {
                "title": "Enhance Team Collaboration",
                "description": f"Foster collaboration in {department} to achieve {goal_description} by {deadline}.",
                "kpi": "90% team participation in initiatives",
                "companyTopBetAlignment": "EMPLOYEE DEVELOPMENT FOCUS",
                "framework3E": "EXTEND",
                "coreValue": "CORE VAL-3"
            },
            {
                "title": "Implement Innovation and Improvement",
                "description": f"Drive innovation in {department} as {job_title} to deliver {key_results} by {deadline}.",
                "kpi": "Implementation of 3 improvements",
                "companyTopBetAlignment": "TRANSFORMING INTO AN AI COMPANY",
                "framework3E": "EXPAND",
                "coreValue": "CORE VAL-2"
            }
        ]

# Example usage and testing
if __name__ == "__main__":
    # Example usage
    try:
        # Initialize with your API key
        generator = SMARTGoalsGenerator(api_key="your_api_key_here")
        
        # Generate goals
        goals = generator.generate_smart_goals(
            job_title="Software Engineer",
            department="Engineering",
            goal_description="Improve code quality and delivery speed",
            key_results="Reduce bugs by 30%, increase deployment frequency by 50%",
            deadline="Q2 2025",
            managers_goal="Enhance team productivity and product reliability"
        )
        
        print("\nGenerated Goals:")
        for i, goal in enumerate(goals, 1):
            print(f"\nGoal {i}: {goal['title']}")
            print(f"Description: {goal['description']}")
            print(f"KPI: {goal['kpi']}")
        
    except Exception as e:
        print(f"Error in example usage: {e}")
