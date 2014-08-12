# Meta

Together with a stranger you are arrested and imprisoned. 
You are put in solitary confinement with no means of speaking to or exchanging messages with each other. 
However, the police admit they don't have enough evidence to convict you on the charge. 
So they offer each of you a Faustian bargain:
Each of you has the opportunity either to *defect* by testifying, 
or to *cooperate* with the other by remaining silent.
You can also *escape* the prison but not without a risk.

Your outcome depends on the actions of the other suspect:

* If both of you *cooperate* you will both go free. (Awarding each of you 2 points)
* If you *defect* while the other *cooperates*, you will go free as a reward for supporting police work, while the other will go to prison. (Awarding you 4 points, while the other loses 1)
* If both of you *defect* you will both go to prison. (Each of you losing 1 point)
* However, if you *escape* while the other *defects*, the other will go to prison because of his testimony.
No bounty will be put on your head, since the police already have an offender. (Awarding you 4 points, while the loses 1)
* If you both *escape* half of the bounty will be put on each of your heads. (Each of you getting 0 points)
* Finally, if you *escape* while the other *cooperates*, the other will go free because of no evidence, while there will be a large bounty on your head. (Awarding the other 4 points, while you lose 1).

This basically means that: 

**Defect** *beats* **Cooperate** *beats* **Escape** *beats* **Defect**, 

while **Cooperate/Cooperate** *beats* **Escape/Escape** *beats* **Defect/Defect**.

More formally the table of possible outcomes looks like this:

<table>
  <tbody>
  <tr>
    <td></td>
    <th scope="col">Cooperate</th>
    <th scope="col">Escape</th>
    <th scope="col">Defect</th>
  </tr>
  <tr>
    <th scope="row">Cooperate</th>
    <td>+2/+2</td>
    <td>+4/-1</td>
    <td>-1/+4</td>
  </tr>
  <tr>
    <th scope="row">Escape</th>
    <td>-1/+4</td>
    <td>0/0</td>
    <td>+4/-1</td>
  </tr>
  <tr>
    <th scope="row">Defect</th>
    <td>+4/-1</td>
    <td>-1/+4</td>
    <td>-1/-1</td>
  </tr>
  </tbody>
</table>

